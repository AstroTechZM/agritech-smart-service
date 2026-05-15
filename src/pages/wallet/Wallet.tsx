/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. DATA MANIPULATION (Filter & Reduce):
 *    - In React, we often take a big list of data (like 'transactions') and 
 *      calculate new values from it (like 'totalEarned').
 */
import React, { useState } from 'react';
import {
  Download,
  Wallet as WalletIcon,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  ChevronRight,
  Plus,
  CheckCircle2,
  Building,
  ArrowLeft
} from 'lucide-react'; // Visual Icons
import { cn } from '@/src/lib/utils'; // Styling helper
import { User } from '@/src/types'; // Types
import { motion, AnimatePresence } from 'motion/react'; // Animation tools
import { useWallet } from '@/src/context/WalletContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'sonner';


interface WalletProps {
  user: User;
}

/**
 * 2. COMPONENT: Wallet
 *    Handles the farmer's financial balance and withdrawals.
 */
export const Wallet = ({ user }: WalletProps) => {
  // 3. UI STATE: Handles the multi-step withdrawal process.
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'METHOD' | 'DETAILS' | 'PASSWORD' | 'SUCCESS'>('METHOD');
  const [selectedMethod, setSelectedMethod] = useState<'BANK' | 'MOBILE' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { balance, transactions, isLoading, addTransaction } = useWallet();

  // Helper to reset modal state
  const resetModal = () => {
    setShowWithdrawModal(false);
    setTimeout(() => {
      setWithdrawStep('METHOD');
      setSelectedMethod(null);
      setWithdrawAmount('');
      setPassword('');
      setIsProcessing(false);
    }, 300);
  };

  /**
   * 4. CALCULATED VALUES:
   *    - Instead of storing everything in state, we calculate what we need 
   *      on every "render" (every time the screen draws).
   *    - .filter() picks only completed payouts.
   *    - .reduce() adds up all their amounts.
   */
  const totalEarned = transactions
    .filter(t => t.type === 'PAYOUT' && t.status === 'COMPLETED')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER SECTION */}
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
        {/* WALLET CARD: Uses a gradient background */}
        <div className="md:col-span-2 primary-gradient p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 text-white">Available Balance</span>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <WalletIcon size={24} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton width="16rem" height="3rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" />
            ) : (
              <h3 className="text-5xl font-black font-headline">ZMW {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            )}
            <div className="flex gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Total Earned (2026)</p>
                {isLoading ? (
                  <Skeleton width="6rem" height="1.5rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" />
                ) : (
                  <p className="text-lg font-black">ZMW {totalEarned.toLocaleString()}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Pending Settlement</p>
                <p className="text-lg font-black">ZMW 1,200.00</p>
              </div>
            </div>
          </div>
          {/* Decorative blurry circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
        </div>


      </div>

      {/* TRANSACTION LIST SECTION */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold font-headline text-neutral-900">Transaction History</h3>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Date,Source,Amount (ZMW),Type,Status\n"
                + transactions.map(t => `${t.id},${t.date},${t.source},${t.amount},${t.type},${t.status}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `wallet_statement_${user.name.replace(/\s+/g, '_')}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <Download size={14} /> Full Statement
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-tx-${i}`} className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Skeleton circle={true} width="3rem" height="3rem" />
                  <div>
                    <Skeleton width="8rem" height="1rem" className="mb-1 block" />
                    <Skeleton width="6rem" height="0.75rem" />
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <Skeleton width="5rem" height="1rem" className="mb-1 block" />
                    <Skeleton width="3rem" height="0.5rem" />
                  </div>
                  <Skeleton width="1rem" height="1rem" />
                </div>
              </div>
            ))
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    // Dynamic colors based on whether it's money coming IN or going OUT
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
            ))
          )}
        </div>
      </div>

      {/* WITHDRAWAL MODAL: Multi-step process */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={resetModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-container-lowest rounded-[3rem] p-8 shadow-2xl relative border border-black/5"
            >
              <button
                onClick={resetModal}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors text-neutral-400"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              {withdrawStep !== 'SUCCESS' && (
                <div className="mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Funds Transfer</span>
                  <h3 className="text-3xl font-black font-headline text-neutral-900">Withdrawal</h3>
                </div>
              )}

              {/* STEP 1: METHOD SELECTION */}
              {withdrawStep === 'METHOD' && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-500 font-medium mb-6">Choose how you would like to receive your funds.</p>
                  <button
                    onClick={() => { setSelectedMethod('MOBILE'); setWithdrawStep('DETAILS'); }}
                    className="w-full p-6 bg-surface-container-low rounded-3xl border border-black/5 flex items-center gap-4 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Smartphone size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-900">Mobile Money</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Instant Settlement</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setSelectedMethod('BANK'); setWithdrawStep('DETAILS'); }}
                    className="w-full p-6 bg-surface-container-low rounded-3xl border border-black/5 flex items-center gap-4 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all">
                      <Building size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-900">Bank Transfer</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">1-2 Business Days</p>
                    </div>
                  </button>
                </div>
              )}

              {/* STEP 2: DETAILS & AMOUNT */}
              {withdrawStep === 'DETAILS' && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-5 rounded-[2rem] border border-primary/10">
                    <p className="text-[10px] font-bold uppercase text-primary mb-3 tracking-widest">Withdrawal Destination</p>

                    {selectedMethod === 'MOBILE' ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase text-neutral-400">Account Name</p>
                          <p className="font-bold text-neutral-900">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-neutral-400">Mobile Number</p>
                          <p className="font-bold text-neutral-900">{user.cell_num || '097 123 4567'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase text-neutral-400">Destination Bank</p>
                          <p className="font-bold text-neutral-900">ZANACO</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-neutral-400">Account Number</p>
                            <p className="font-bold text-neutral-900">1029348821</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase text-neutral-400">Account Owner</p>
                            <p className="font-bold text-neutral-900">{user.name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Amount to Withdraw</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-neutral-400 text-sm">ZMW</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-14 text-2xl font-black placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setWithdrawStep('METHOD')}
                      className="w-16 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                      onClick={() => {
                        const amount = parseFloat(withdrawAmount);
                        if (amount > balance) {
                          toast.error('Insufficient funds.');
                          return;
                        }
                        setWithdrawStep('PASSWORD');
                      }}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-black font-headline text-sm shadow-xl shadow-primary/20 disabled:opacity-50 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PASSWORD VERIFICATION */}
              {withdrawStep === 'PASSWORD' && (
                <div className="space-y-6">
                  <div className="text-center bg-neutral-50 p-6 rounded-3xl border border-black/5">
                    <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Total to Send</p>
                    <p className="text-3xl font-black text-neutral-900 font-headline">ZMW {parseFloat(withdrawAmount).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-widest">+ ZMW 12.00 Fee</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Enter Password to Confirm</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-center text-xl font-black focus:ring-2 focus:ring-primary/20 transition-all tracking-widest"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setWithdrawStep('DETAILS')}
                      className="w-16 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      disabled={!password || isProcessing}
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(async () => {
                          try {
                            await addTransaction({
                              source: selectedMethod === 'MOBILE' ? 'Mobile Money Transfer' : 'Bank Transfer',
                              amount: parseFloat(withdrawAmount),
                              type: 'WITHDRAWAL',
                            });
                            setWithdrawStep('SUCCESS');
                          } catch (err) {
                            toast.error('Failed to process withdrawal. Please try again.');
                          } finally {
                            setIsProcessing(false);
                          }
                        }, 1500);
                      }}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-black font-headline text-sm shadow-xl shadow-primary/20 disabled:opacity-50 transition-all flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'Confirm & Send Money'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {withdrawStep === 'SUCCESS' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black font-headline text-neutral-900 mb-2">Withdrawal Initiated!</h3>
                  <p className="text-xs text-neutral-500 font-medium px-4 leading-relaxed">
                    ZMW {withdrawAmount} is being sent to your {selectedMethod === 'MOBILE' ? 'Mobile Money' : 'Bank Account'}.
                    It should arrive in your account shortly.
                  </p>
                  <button
                    onClick={resetModal}
                    className="mt-8 w-full bg-neutral-900 text-white py-4 rounded-2xl font-black font-headline text-sm shadow-xl"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
