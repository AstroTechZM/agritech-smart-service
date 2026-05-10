import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, QrCode, Map as MapIcon, X, Navigation, Locate } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';
import { toast } from 'sonner';

interface VouchersProps {
  role: UserRole;
}

export const Vouchers = ({ role }: VouchersProps) => {
  const isFarmer = role === UserRole.FARMER;
  const isAdmin = role === UserRole.ADMIN;

  const [showQRModal, setShowQRModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);

  // Simulated dealers data for the map
  const dealers = [
    { id: 1, name: "AgriTech Hub - Central", dist: "2.4 km", x: 60, y: 40, stock: "D-Compound" },
    { id: 2, name: "Farmers Co-op", dist: "5.1 km", x: 30, y: 70, stock: "D-Compound" },
    { id: 3, name: "Zambia Seeds Ltd", dist: "8.7 km", x: 80, y: 20, stock: "Maize Seeds" },
  ];

  const handleLocateUser = () => {
    toast.info("Accessing GPS...");
    setTimeout(() => {
      setUserLocation({ x: 50, y: 50 });
      toast.success("Location captured!");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
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
                <div className="w-48 h-48 bg-white border border-black/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <QrCode size={160} strokeWidth={1} className="text-neutral-800" />
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

              {/* INTERACTIVE MAP SIMULATION */}
              <div className="aspect-video bg-neutral-100 rounded-3xl border border-black/10 relative overflow-hidden mb-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <svg className="w-full h-full opacity-20 absolute inset-0">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simulated Roads/Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                  <path d="M0,50 Q200,100 400,50 T800,50" fill="none" stroke="black" strokeWidth="20" strokeLinecap="round" />
                  <path d="M100,0 Q150,200 100,400" fill="none" stroke="black" strokeWidth="15" strokeLinecap="round" />
                </svg>

                {/* Dealer Pins */}
                {dealers.map((dealer) => (
                  <motion.div
                    key={dealer.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute cursor-pointer group"
                    style={{ left: `${dealer.x}%`, top: `${dealer.y}%` }}
                    onClick={() => toast.info(`Selected: ${dealer.name}`)}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-full">
                       <MapIcon size={32} className="text-primary fill-white drop-shadow-lg" />
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                         {dealer.name}
                       </div>
                    </div>
                  </motion.div>
                ))}

                {/* User Pin */}
                {userLocation && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute"
                    style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                    </div>
                  </motion.div>
                )}

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={handleLocateUser}
                    className="w-10 h-10 bg-white border border-black/10 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-50 shadow-sm"
                  >
                    <Locate size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {dealers.map((dealer) => (
                  <div key={dealer.id} className={cn(
                    "p-4 rounded-2xl flex justify-between items-center border transition-all",
                    dealer.id === 1 ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-black/5"
                  )}>
                    <div>
                      <p className="font-bold text-sm text-neutral-900">{dealer.name}</p>
                      <p className="text-xs text-neutral-500">{dealer.dist} away • In Stock: {dealer.stock}</p>
                    </div>
                    <button 
                      onClick={() => toast.success(`Navigation started to ${dealer.name}`)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all",
                        dealer.id === 1 ? "bg-primary text-white shadow-primary/20" : "bg-neutral-200 text-neutral-500"
                      )}
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vouchers;
