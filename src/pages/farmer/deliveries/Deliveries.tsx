/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. RESPONSIVE DESIGN IN REACT (JSX):
 *    - We use prefixes like 'sm:' or 'lg:' to change how things look on different screens.
 *    - In React, we can also use these classes to hide/show elements based on device size.
 */
import React, { useState } from 'react';
import { Map as MapIcon, ChevronRight } from 'lucide-react'; // Icons
import { motion, AnimatePresence } from 'motion/react'; // Animations
import { cn } from '@/src/lib/utils'; // Styling helper
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * 2. COMPONENT: Deliveries
 *    Shows a history of crop deliveries and their payment status.
 */
export const Deliveries = () => {
  // 3. STATE: Tracks which delivery is currently "clicked" to show details.
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  // 4. DATA: We pull our list of deliveries from a separate data file via an API simulation.
  const { data: deliveries, isLoading } = useApi(api.fetchDeliveries);

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
              Harvest Records
            </span>
            <h2 className="text-3xl font-black font-headline tracking-tight">Deliveries History</h2>
          </div>
        </div>

        {/* 5. GRID SYSTEM: 1 column on mobile, 2 on tablets, 3 on large screens. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`skel-del-${i}`} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <Skeleton width="4rem" height="0.75rem" />
                  <Skeleton width="8rem" height="1.5rem" />
                  <Skeleton width="6rem" height="1rem" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton width="5rem" height="0.75rem" />
                  <Skeleton width="6rem" height="1.5rem" />
                  <Skeleton width="4rem" height="1.5rem" borderRadius="1rem" />
                </div>
              </div>
            ))
          ) : (
            (deliveries || []).map((del) => (
              <div
              key={del.id}
              onClick={() => setSelectedDelivery(del)}
              className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                  <div className="text-[10px] uppercase font-black tracking-widest text-neutral-400">{del.date}</div>
                  {/* HIDING/SHOWING: This tag only shows on tiny mobile screens ('sm:hidden') */}
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest sm:hidden",
                    del.paymentStatus === 'PAID' ? "bg-tertiary/10 text-tertiary" :
                      del.paymentStatus === 'PROCESSING' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                  )}>
                    {del.paymentStatus}
                  </span>
                </div>
                <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{del.produceType}</p>
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 flex items-center gap-1"><MapIcon size={10} /> {del.depot}</div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-none border-black/5">
                <div className="text-right sm:text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">Estimated Payout</p>
                  <p className="text-lg font-black font-mono text-primary leading-none">{del.amount}</p>
                </div>
                {/* HIDING/SHOWING: This tag is hidden on mobile, but shows on larger screens ('hidden sm:inline-block') */}
                <span className={cn(
                  "hidden sm:inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  del.paymentStatus === 'PAID' ? "bg-tertiary/10 text-tertiary" :
                    del.paymentStatus === 'PROCESSING' ? "bg-primary/10 text-primary animate-pulse" :
                      "bg-error/10 text-error"
                )}>
                  {del.paymentStatus}
                </span>
                <span className="sm:hidden text-[10px] text-primary font-bold">Details <ChevronRight size={12} className="inline -mt-0.5" /></span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* 6. MODAL SYSTEM: Explained in Logistics.tsx but used here as well. */}
      <AnimatePresence>
        {selectedDelivery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDelivery(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDelivery(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-neutral-500 transition-colors"
              >
                <span className="text-lg font-black leading-none mb-0.5">✕</span>
              </button>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
                Delivery Receipt
              </span>
              <h3 className="text-2xl font-black font-headline mb-6">{selectedDelivery.id}</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Date</span>
                  <span className="text-sm font-bold">{selectedDelivery.date}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Delivery Depot</span>
                  <span className="text-sm font-bold text-right text-primary">{selectedDelivery.depot}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Produce Type</span>
                  <span className="text-sm font-bold">{selectedDelivery.produceType}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Weight</span>
                  <span className="text-sm font-bold">{selectedDelivery.weight}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Quality Details</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-xs font-black text-primary">Grade {selectedDelivery.grade}</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Moist: {selectedDelivery.moisture}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 bg-primary/5 p-4 rounded-2xl flex justify-between items-center border border-primary/10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Total Payout</p>
                    <p className="font-black font-mono text-xl tracking-tight text-primary">{selectedDelivery.amount}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest block",
                      selectedDelivery.paymentStatus === 'PAID' ? "bg-tertiary border border-tertiary/20 text-white shadow-lg shadow-tertiary/20" :
                        selectedDelivery.paymentStatus === 'PROCESSING' ? "bg-white text-primary border border-primary/20 shadow-lg animate-pulse" :
                          "bg-error/10 text-error"
                    )}>
                      {selectedDelivery.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Deliveries;
