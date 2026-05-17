import React, { useState } from 'react';
import { QrCode, ShieldCheck, Loader2, History, User, Package, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/services';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';

export const RedemptionPortal = () => {
  const [pin, setPin] = useState('');
  const { isLoading: isRedeeming, execute: redeemVoucher } = useApi(api.redeemVoucher, { immediate: false });
  const { data: redemptions, isLoading: isLoadingHistory, refresh } = useApi(api.fetchRedemptions);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast.error("Please enter a Voucher PIN or ID");
      return;
    }

    try {
      await redeemVoucher(pin);
      toast.success("Voucher redeemed successfully!");
      setPin('');
      refresh(); // Refresh the history list
    } catch (error: any) {
      toast.error(error.message || "Failed to redeem voucher");
    }
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'id' as const,
      className: 'font-mono text-[10px] text-neutral-400'
    },
    { 
      header: 'Farmer', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-neutral-400" />
          <span className="font-bold text-sm">{row.farmer}</span>
        </div>
      )
    },
    { 
      header: 'Item', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <Package size={14} className="text-primary" />
          <span className="font-bold text-sm">{row.item}</span>
        </div>
      )
    },
    { 
      header: 'Date', 
      accessor: 'date' as const,
      className: 'text-xs text-neutral-500'
    },
    { 
      header: 'Status', 
      accessor: (row: any) => <Badge variant="tertiary">{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Redemption Portal"
        category="Dealer Operations"
        subtitle="Process farmer vouchers and verify input distributions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* REDEMPTION ACTION CARD */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm sticky top-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">New Redemption</h3>
                <p className="text-xs text-neutral-500 font-bold">Scan QR or enter PIN code</p>
              </div>
            </div>

            <form onSubmit={handleRedeem} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Voucher PIN / ID</label>
                <input 
                  type="text" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="e.g. 829 401"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-2xl font-mono font-black tracking-widest text-center focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-200"
                />
              </div>

              <button 
                type="submit"
                disabled={isRedeeming}
                className="w-full primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isRedeeming ? (
                  <>Verifying PIN... <Loader2 size={20} className="animate-spin" /></>
                ) : (
                  <>Process Redemption <ShieldCheck size={20} /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-black/5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-4">Input Verification Checklist</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <div className="w-4 h-4 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"><ShieldCheck size={10} /></div>
                  Verify Farmer Identity (NRC Card)
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <div className="w-4 h-4 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"><ShieldCheck size={10} /></div>
                  Confirm bag count matches voucher
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <div className="w-4 h-4 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"><ShieldCheck size={10} /></div>
                  Ensure digital signature is captured
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold font-headline">Recent Redemptions</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
              <History size={14} />
              Last 24 Hours
            </div>
          </div>

          <DataTable 
            columns={columns}
            data={redemptions || []}
            isLoading={isLoadingHistory}
            rowKey={(r) => r.id}
            emptyMessage="No redemptions processed today."
          />
        </div>
      </div>
    </div>
  );
};

export default RedemptionPortal;

