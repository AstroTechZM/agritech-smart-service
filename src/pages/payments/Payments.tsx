import React, { useState, useMemo } from 'react';
import { Download, Wallet, Clock, AlertTriangle, Search, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/services/api';
import { useApi } from '@/src/hooks/useApi';

export const Payments = () => {
  const { data: payments, isLoading, setData: setPayments } = useApi(api.fetchPayments);

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    return payments.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nrc.includes(searchQuery);
      const matchesDistrict = districtFilter === 'All Districts' || p.district === districtFilter;
      const matchesStatus = statusFilter === 'All Status' || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [payments, searchQuery, districtFilter, statusFilter]);

  const stats = useMemo(() => {
    if (!payments) return [];
    const disbursed = payments.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.amount, 0);
    const pendingList = payments.filter(p => p.status === 'PENDING');
    const pendingAmount = pendingList.reduce((sum, p) => sum + p.amount, 0);
    const failedAmount = payments.filter(p => p.status === 'CANCELLED').reduce((sum, p) => sum + p.amount, 0);

    return [
      { label: 'Total Disbursed', value: `ZMW ${(disbursed / 1000).toFixed(1)}k`, trend: 'Updated', icon: Wallet },
      { label: 'Pending Amount', value: `ZMW ${(pendingAmount / 1000).toFixed(1)}k`, trend: `${pendingList.length} Farmers`, icon: Clock },
      { label: 'Failed Payments', value: `ZMW ${(failedAmount / 1000).toFixed(1)}k`, trend: 'Action Required', icon: AlertTriangle },
    ];
  }, [payments]);

  const handleBulkApprove = () => {
    if (!payments) return;
    setPayments(payments.map(p => p.status === 'PENDING' ? { ...p, status: 'APPROVED' } : p));
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Farmer Name,NRC,Qty,Amount,Method,Status,District\n"
      + filteredPayments.map(p => `${p.name},${p.nrc},${p.qty},${p.amount},${p.method},${p.status},${p.district}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Fetching Payment Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Financial Oversight</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Farmer Payments</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkApprove}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 size={16} /> Bulk Approve
          </button>
          <button 
            onClick={handleExport}
            className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-black/5 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold uppercase text-neutral-500">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <div className="flex gap-4">
            <select 
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option>All Districts</option>
              <option>Lusaka</option>
              <option>Choma</option>
              <option>Kasama</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              placeholder="Search farmer or NRC..." 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">Farmer Name</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">NRC</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">Qty (Bags)</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">Method</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((row) => (
                  <tr key={row.nrc} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-5 font-bold text-sm text-neutral-900">{row.name}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500 font-mono">{row.nrc}</td>
                  <td className="px-8 py-5 text-xs font-black">{row.qty}</td>
                  <td className="px-8 py-5 text-xs font-black text-primary">ZMW {row.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-xs font-medium text-neutral-500 uppercase tracking-widest">{row.method}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      row.status === 'APPROVED' ? "bg-primary/10 text-primary border border-primary/20" :
                        row.status === 'PENDING' ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : "bg-error/10 text-error border border-error/20"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-neutral-400 font-bold text-sm">
                    No payments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
