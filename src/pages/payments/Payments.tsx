import React from 'react';
import { Download, Wallet, Clock, AlertTriangle, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Payments = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Financial Oversight</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Farmer Payments</h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
            Bulk Approve
          </button>
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Disbursed', value: 'ZMW 142.5M', trend: '+12%', icon: Wallet },
          { label: 'Pending Amount', value: 'ZMW 12.8M', trend: '842 Farmers', icon: Clock },
          { label: 'Failed Payments', value: 'ZMW 420K', trend: 'Action Required', icon: AlertTriangle },
        ].map((stat) => (
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
            <select className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all">
              <option>All Districts</option>
              <option>Lusaka</option>
              <option>Choma</option>
            </select>
            <select className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input className="bg-surface-container-low border-none rounded-xl text-xs pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search farmer or NRC..." />
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
              {[
                { name: 'Loveness Phiri', nrc: '482910/11/1', qty: 12, amount: 3360, method: 'MoMo', status: 'APPROVED' },
                { name: 'Kelvin Banda', nrc: '110928/65/1', qty: 25, amount: 7000, method: 'Bank', status: 'PENDING' },
                { name: 'Mutale Kapwepwe', nrc: '338102/52/1', qty: 8, amount: 2240, method: 'MoMo', status: 'CANCELLED' },
              ].map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
