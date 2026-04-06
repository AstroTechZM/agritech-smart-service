import React from 'react';
import { Ticket, CheckCircle2, QrCode, Map as MapIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';

interface VouchersProps {
  role: UserRole;
}

export const Vouchers = ({ role }: VouchersProps) => {
  const isFarmer = role === UserRole.FARMER;
  const isAdmin = role === UserRole.ADMIN;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {isAdmin ? 'System Oversight' : 'Voucher Management'}
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">
            {isAdmin ? 'Voucher Analytics' : 'FISP Eligibility & Vouchers'}
          </h2>
        </div>
        {isFarmer && (
          <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest rounded-full border border-primary/20">
            ELIGIBLE FOR 2026
          </span>
        )}
      </div>

      {isFarmer && (
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Eligibility Check Result</h3>
              <p className="text-sm text-neutral-500">Your profile has been verified for the current farming season.</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-3xl border border-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-500">Active Voucher</p>
                  <h4 className="text-2xl font-black font-headline">D-Compound Fertilizer</h4>
                </div>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">Valid</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">PIN Code</p>
                  <p className="text-lg font-mono font-black tracking-widest">••••••</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Input Type</p>
                  <p className="text-sm font-bold">Fertilizer</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Amount</p>
                  <p className="text-sm font-bold">8 Bags (400kg)</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Expiry Date</p>
                  <p className="text-sm font-bold">30 Nov 2026</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                  <QrCode size={20} /> Show Redemption QR
                </button>
                <button className="flex-1 bg-white border border-black/10 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-all">
                  <MapIcon size={20} /> Find Nearest Agro-Dealer
                </button>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-headline px-1">Voucher History</h3>
        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Voucher ID</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Input</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { id: 'V-9921', type: 'D-Compound Fertilizer', date: '12 Oct 2025', status: 'ACTIVE' },
                { id: 'V-8810', type: 'Maize Seed (10kg)', date: '05 Sep 2025', status: 'REDEEMED' },
                { id: 'V-7705', type: 'Urea Fertilizer', date: '20 Oct 2024', status: 'EXPIRED' },
              ].map((v) => (
                <tr key={v.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-sm">{v.id}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500 font-medium">{v.type}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500 font-medium">{v.date}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      v.status === 'ACTIVE' ? "bg-primary/10 text-primary" :
                        v.status === 'REDEEMED' ? "bg-tertiary/10 text-tertiary" : "bg-neutral-100 text-neutral-400"
                    )}>
                      {v.status}
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

export default Vouchers;
