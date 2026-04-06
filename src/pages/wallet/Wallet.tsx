import React, { useState } from 'react';
import { 
  Download, 
  Wallet as WalletIcon, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MOCK_TRANSACTIONS } from '@/src/data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export const Wallet = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  const transactions = MOCK_TRANSACTIONS;
  const balance = 4850.00;
  const totalEarned = transactions
    .filter(t => t.type === 'PAYOUT' && t.status === 'COMPLETED')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Personal Financials</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">My Wallet</h2>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-headline"
        >
          <Smartphone size={16} /> New Withdrawal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 primary-gradient p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 text-white">Available Balance</span>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <WalletIcon size={24} />
              </div>
            </div>
            <h3 className="text-5xl font-black font-headline">ZMW {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <div className="flex gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Total Earned (2026)</p>
                <p className="text-lg font-black">ZMW {totalEarned.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Pending Settlement</p>
                <p className="text-lg font-black">ZMW 1,200.00</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary mb-6">
              <Clock size={24} />
            </div>
            <h4 className="text-xl font-bold font-headline mb-2 leading-tight text-neutral-900">Fast Withdrawals</h4>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Funds are typically settled to your Mobile Money account within <span className="font-bold text-neutral-900">15 minutes</span> of withdrawal.
            </p>
          </div>
          <div className="flex bg-neutral-100 p-1 rounded-xl mt-4 shrink-0">
             <div className="flex-1 text-[8px] font-black uppercase text-center py-2 bg-white rounded-lg shadow-sm text-primary">Airtel</div>
             <div className="flex-1 text-[8px] font-black uppercase text-center py-2 text-neutral-400">MTN</div>
             <div className="flex-1 text-[8px] font-black uppercase text-center py-2 text-neutral-400">Zamtel</div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold font-headline text-neutral-900">Transaction History</h3>
          <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Download size={14} /> Full Statement
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  tx.type === 'PAYOUT' ? "bg-success/10 text-success group-hover:bg-success group-hover:text-white" : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-600 group-hover:text-white"
                )}>
                  {tx.type === 'PAYOUT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{tx.source}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{tx.id}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span className="text-[10px] font-bold text-neutral-500">{tx.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className={cn(
                    "text-sm font-black",
                    tx.type === 'PAYOUT' ? "text-success" : "text-neutral-900"
                  )}>
                    {tx.type === 'PAYOUT' ? '+' : '-'} ZMW {tx.amount.toLocaleString()}
                  </p>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    tx.status === 'COMPLETED' ? "text-neutral-400" : "text-tertiary animate-pulse"
                  )}>
                    {tx.status}
                  </span>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm shadow-xl"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-[3rem] p-8 shadow-2xl relative border border-black/5"
            >
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors text-neutral-400"
              >
                <Plus className="rotate-45" size={24} />
              </button>
              
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Funds Transfer</span>
              <h3 className="text-3xl font-black font-headline mb-8 text-neutral-900">New Withdrawal</h3>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Select Network</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Airtel', 'MTN', 'Zamtel'].map(net => (
                      <button key={net} className={cn(
                        "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        net === 'Airtel' ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-neutral-50 border-black/5 text-neutral-400 hover:border-black/10"
                      )}>
                        {net}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Phone Number</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all font-mono" 
                    placeholder="097 XXX XXXX"
                    defaultValue="097 123 4567"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-neutral-400 text-sm">ZMW</span>
                    <input 
                      type="number"
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-14 text-2xl font-black placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="bg-neutral-100 p-5 rounded-3xl space-y-1.5 border border-black/5">
                   <div className="flex justify-between items-center text-neutral-500">
                     <span className="text-[10px] font-bold uppercase tracking-widest">Transaction Fee</span>
                     <span className="text-xs font-bold text-neutral-900">ZMW 12.00</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Net Settlement</span>
                     <span className="text-lg font-black text-primary">ZMW 0.00</span>
                   </div>
                </div>

                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Confirm Withdrawal
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
