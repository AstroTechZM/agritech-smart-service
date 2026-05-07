/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. PROPS (Properties):
 *    - 'role' is a Prop. It's like a setting passed from the parent (AppShell) to this page.
 *    - We use it here to decide what content to show (Farmer view vs. Admin view).
 */
import React, { useState } from 'react';
import { Ticket, CheckCircle2, QrCode, Map as MapIcon, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';

interface VouchersProps {
  role: UserRole;
}

/**
 * 2. COMPONENT: Vouchers
 *    The page where users manage their FISP input vouchers or admins view analytics.
 */
export const Vouchers = ({ role }: VouchersProps) => {
  // Logic to check the current user's role
  const isFarmer = role === UserRole.FARMER;
  const isAdmin = role === UserRole.ADMIN;

  const [showQRModal, setShowQRModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    // 'animate-in' provides a smooth fade-in effect when the page loads.
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          {/* We use a ternary operator (?) to show different text based on the role */}
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {isAdmin ? 'System Oversight' : 'Voucher Management'}
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">
            {isAdmin ? 'Voucher Analytics' : 'FISP Eligibility & Vouchers'}
          </h2>
        </div>

      </div>

      {isFarmer && (
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">


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
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <QrCode size={20} /> Show Redemption QR
                </button>
                <button 
                  onClick={() => setShowMapModal(true)}
                  className="flex-1 bg-white border border-black/10 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-all"
                >
                  <MapIcon size={20} /> Find Nearest Agro-Dealer
                </button>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* 4. MAPPING LISTS: 
            We take a list of data and "Map" it into rows of a table. 
            This is how we show multiple items without writing the HTML for each one manually. */}
        <h3 className="text-lg font-bold font-headline px-1">Voucher History</h3>
        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-4 text-xs font-bold uppercase text-neutral-400">Voucher ID</th>
                <th className="px-8 py-4 text-xs font-bold uppercase text-neutral-400">Input</th>
                <th className="px-8 py-4 text-xs font-bold uppercase text-neutral-400">Date</th>
                <th className="px-8 py-4 text-xs font-bold uppercase text-neutral-400">Status</th>
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
                    {/**
                     * 5. DYNAMIC STYLING (cn):
                     *    The 'cn' helper allows us to change colors based on the status.
                     *    Notice how ACTIVE is primary, REDEEMED is tertiary, etc.
                     */}
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

      {/* QR CODE MODAL */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-[3rem] w-full max-w-sm shadow-2xl relative border border-black/5 text-center"
            >
              <button 
                onClick={() => setShowQRModal(false)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:bg-black/5 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Redemption</span>
                <h3 className="text-2xl font-black font-headline text-neutral-900">Show to Dealer</h3>
              </div>

              <div className="bg-surface-container-low p-6 rounded-3xl border border-black/5 inline-block mx-auto mb-6">
                {/* Mock QR Code representation */}
                <div className="w-48 h-48 bg-white border border-black/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <QrCode size={160} strokeWidth={1} className="text-neutral-800" />
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 shadow-[0_0_10px_2px_rgba(var(--color-primary),0.5)] animate-[bounce_3s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-neutral-500 mb-1">Voucher PIN</p>
                <p className="text-3xl font-mono font-black tracking-widest text-primary">829 401</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAP MODAL */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest p-6 rounded-[3rem] w-full max-w-lg shadow-2xl relative border border-black/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black font-headline text-neutral-900">Nearest Agro-Dealers</h3>
                  <p className="text-xs text-neutral-500 font-bold">Showing locations with available stock</p>
                </div>
                <button 
                  onClick={() => setShowMapModal(false)}
                  className="p-2 text-neutral-400 hover:bg-black/5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Fake Map Container */}
              <div className="aspect-video bg-neutral-100 rounded-3xl border border-black/10 relative overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop" 
                  alt="Map View" 
                  className="w-full h-full object-cover opacity-60" 
                />
                {/* Fake map pins */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-xl animate-bounce">
                  <MapIcon size={32} className="fill-white" />
                </div>
                <div className="absolute top-1/3 left-1/4 text-neutral-400 drop-shadow-xl">
                  <MapIcon size={24} className="fill-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-surface-container-low rounded-2xl flex justify-between items-center border border-primary/20">
                  <div>
                    <p className="font-bold text-sm text-neutral-900">AgriTech Hub - Central</p>
                    <p className="text-xs text-neutral-500">2.4 km away • In Stock: D-Compound</p>
                  </div>
                  <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Navigation size={18} />
                  </button>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl flex justify-between items-center border border-black/5">
                  <div>
                    <p className="font-bold text-sm text-neutral-900">Farmers Co-op</p>
                    <p className="text-xs text-neutral-500">5.1 km away • In Stock: D-Compound</p>
                  </div>
                  <button className="w-10 h-10 bg-neutral-200 text-neutral-500 rounded-xl flex items-center justify-center">
                    <Navigation size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vouchers;
