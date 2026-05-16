import React, { useState, useMemo } from 'react';
import { Download, Wallet, Clock, AlertTriangle, Search, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/services';
import { useApi } from '@/src/hooks/useApi';
import PageHeader from '@/src/components/ui/PageHeader';
import StatCard from '@/src/components/ui/StatCard';
import Badge, { BadgeVariant } from '@/src/components/ui/Badge';
import DataTable from '@/src/components/ui/DataTable';
import { toast } from 'sonner';

export const Payments = () => {
  const { data: payments, isLoading, setData: setPayments, execute: refreshPayments } = useApi(api.fetchPayments);
  const { execute: approveAll } = useApi(api.approveAllPendingPayments, { immediate: false });

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    return payments.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.nrc || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = districtFilter === 'All Districts' || (p.district || '') === districtFilter;
      const matchesStatus = statusFilter === 'All Status' || (p.status || '').toLowerCase() === statusFilter.toLowerCase();
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

  const handleBulkApprove = async () => {
    if (!payments) return;
    try {
        await approveAll();
        toast.success("All pending payments approved and disbursed!");
        refreshPayments();
    } catch (error) {
        toast.error("Failed to process bulk approval.");
    }
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

  const columns = [
    { 
      header: 'Farmer Name', 
      accessor: 'name' as const,
      className: 'font-bold text-neutral-900' 
    },
    { 
      header: 'NRC', 
      accessor: 'nrc' as const,
      className: 'text-neutral-500 font-mono',
      skeletonWidth: '6rem'
    },
    { 
      header: 'Qty (Bags)', 
      accessor: 'qty' as const,
      className: 'font-black',
      skeletonWidth: '2rem'
    },
    { 
      header: 'Amount', 
      accessor: (row: any) => `ZMW ${row.amount.toLocaleString()}`,
      className: 'font-black text-primary',
      skeletonWidth: '5rem'
    },
    { 
      header: 'Method', 
      accessor: 'method' as const,
      className: 'font-medium text-neutral-500 uppercase tracking-widest',
      skeletonWidth: '4rem'
    },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        const variant: BadgeVariant = 
          row.status === 'APPROVED' ? 'primary' :
          row.status === 'PENDING' ? 'tertiary' : 'error';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
      skeletonWidth: '4rem'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Farmer Payments"
        category="Financial Oversight"
        actions={
          <>
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
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <StatCard key={`skel-${i}`} label="" isLoading={true} />
          ))
        ) : (
          stats.map((stat) => (
            <StatCard 
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none flex-1 md:flex-none"
            >
              <option>All Districts</option>
              <option>Lusaka</option>
              <option>Choma</option>
              <option>Kasama</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none flex-1 md:flex-none"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="relative w-full md:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-xs pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              placeholder="Search farmer or NRC..." 
            />
          </div>
        </div>

        <DataTable 
          columns={columns}
          data={filteredPayments}
          isLoading={isLoading}
          rowKey={(p) => p.nrc}
          emptyMessage="No payments found matching your filters."
        />
      </div>
    </div>
  );
};

export default Payments;
