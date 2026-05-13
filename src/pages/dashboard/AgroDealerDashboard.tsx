import React, { useState } from 'react';
import { QrCode, CheckCircle2, Wallet, AlertTriangle, X, Camera, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { User } from '@/src/types';
import { MOCK_DEFAULTS } from '@/src/constants';
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AgroDealerDashboardProps {
  user: User | null;
}

export const AgroDealerDashboard = ({ user }: AgroDealerDashboardProps) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionStep, setRedemptionStep] = useState<'SCAN' | 'CONFIRM' | 'SUCCESS'>('SCAN');
  
  const { data: stockItems } = useApi(api.fetchStock);
  const { data: redemptions, setData: setRedemptions } = useApi(api.fetchRedemptions);

  const totalRedemptions = (redemptions || []).length;
  const pendingClaims = (redemptions || []).reduce((sum, r) => sum + r.amount, 0);
  const lowStockCount = (stockItems || []).filter(i => i.status === 'LOW').length;

  const handleRedeemSuccess = () => {
    setRedemptionStep('SUCCESS');
    const newRedemption = {
      id: `RED-${Date.now()}`,
      farmer: MOCK_DEFAULTS.FARMER_NAME,
      items: '2 Packs Maize Seed',
      time: 'Just now',
      amount: 800
    };
    if (redemptions) {
      setRedemptions([newRedemption, ...redemptions]);
    }
    toast.success('Voucher redeemed successfully!');
    setTimeout(() => {
      setIsRedeeming(false);
      setRedemptionStep('SCAN');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Agro-Dealer Portal</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">{user?.name || 'Zambia Agro Hub Ltd'}</h2>
          <p className="text-sm text-neutral-500">License: AD-2024-991</p>
        </div>
        <button
          onClick={() => setIsRedeeming(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <QrCode size={20} /> Redeem Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Redemptions', value: totalRedemptions, trend: '+4%', icon: CheckCircle2 },
          { label: 'Pending Claims', value: `ZMW ${pendingClaims.toLocaleString()}`, trend: 'Processing', icon: Wallet },
          { label: 'Stock Alerts', value: `${lowStockCount} Low`, trend: lowStockCount > 0 ? 'Action Needed' : 'Healthy', icon: AlertTriangle },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <stat.icon size={24} />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === 'Action Needed' ? "bg-error/10 text-error" : "bg-primary/5 text-primary"
              )}>{stat.trend}</span>
            </div>
            <p className="text-xs font-bold uppercase text-neutral-500">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Current Stock Inventory</h3>
            <button className="text-xs font-bold text-primary">Manage Stock</button>
          </div>
          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-400">Input Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-400">Current Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(stockItems || []).map((item) => (
                  <tr key={item.name}>
                    <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-medium">{item.qty} {item.unit}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[9px] font-black uppercase",
                        item.status === 'STABLE' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Recent Redemptions</h3>
            <button className="text-xs font-bold text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {(redemptions || []).map((r) => (
              <div key={r.id} className="bg-surface-container-low p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{r.farmer}</p>
                  <p className="text-xs text-neutral-400">{r.items}</p>
                </div>
                <p className="text-xs font-bold text-neutral-400">{r.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Redemption Modal */}
      <AnimatePresence>
        {isRedeeming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-md shadow-2xl relative border border-black/5 overflow-hidden"
            >
              <button 
                onClick={() => setIsRedeeming(false)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:bg-black/5 rounded-full z-10"
              >
                <X size={20} />
              </button>

              {redemptionStep === 'SCAN' && (
                <div className="text-center">
                  <div className="mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Voucher System</span>
                    <h3 className="text-3xl font-black font-headline">Scan QR Code</h3>
                    <p className="text-sm text-neutral-500 mt-2">Position the farmer's voucher QR code within the frame.</p>
                  </div>

                  <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-neutral-900 rounded-[2rem] overflow-hidden mb-8 border-4 border-primary/20">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                      <Camera size={48} className="mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Waiting for Camera...</p>
                    </div>
                    {/* Scanning animation */}
                    <motion.div 
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-4 right-4 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),1)] z-10"
                    />
                    <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
                  </div>

                  <button 
                    onClick={() => setRedemptionStep('CONFIRM')}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Simulate Scan Detect
                  </button>
                </div>
              )}

              {redemptionStep === 'CONFIRM' && (
                <div>
                  <div className="mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Verify Identity</span>
                    <h3 className="text-3xl font-black font-headline">Confirm Voucher</h3>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 mb-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden">
                        <img src="https://picsum.photos/seed/farmer123/100" alt="Farmer" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-neutral-900">{MOCK_DEFAULTS.FARMER_NAME}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">NRC: {MOCK_DEFAULTS.FARMER_NRC}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Items for Redemption</p>
                      <p className="font-bold text-sm">2 Packs Maize Seed (10kg)</p>
                      <p className="text-[10px] text-primary font-black mt-1">SUBSIDIZED VALUE: ZMW 800.00</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setRedemptionStep('SCAN')}
                      className="flex-1 bg-surface-container-low text-neutral-600 py-4 rounded-2xl font-bold text-sm"
                    >
                      Retry
                    </button>
                    <button 
                      onClick={handleRedeemSuccess}
                      className="flex-2 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20"
                    >
                      Confirm Redemption
                    </button>
                  </div>
                </div>
              )}

              {redemptionStep === 'SUCCESS' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-tertiary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-tertiary/20">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-3xl font-black font-headline text-neutral-900">Success!</h3>
                  <p className="text-sm text-neutral-500 mt-2">The voucher has been processed.<br/>Stock will be updated automatically.</p>
                  <div className="mt-8">
                    <Loader2 className="mx-auto text-primary animate-spin" />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgroDealerDashboard;
