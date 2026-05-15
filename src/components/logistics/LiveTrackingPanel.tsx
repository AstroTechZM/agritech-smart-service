import React from 'react';
import { Truck, X, Radio, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface LiveTrackingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  shipments: any[];
}

export const LiveTrackingPanel = ({ isOpen, onClose, shipments }: LiveTrackingPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface-container-lowest rounded-[3rem] shadow-2xl ring-1 ring-black/5 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Fleet Operations</p>
                <h3 className="text-2xl font-black font-headline text-white">Live Fleet Tracker</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase">Simulated Feed</span>
                </div>
                <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Fleet List */}
            <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
              {shipments.map((s: any) => (
                <div key={s.id} className="bg-surface-container-low p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        s.status === 'IN TRANSIT' ? 'bg-primary/10 text-primary' :
                        s.status === 'DELAYED' ? 'bg-error/10 text-error' : 'bg-neutral-100 text-neutral-400'
                      )}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{s.vehicle}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase">{s.from} → {s.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Radio size={12} className={cn(
                          s.status === 'IN TRANSIT' ? 'text-primary animate-pulse' :
                          s.status === 'DELAYED' ? 'text-error' : 'text-neutral-400'
                        )} />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          s.status === 'IN TRANSIT' ? 'text-primary' :
                          s.status === 'DELAYED' ? 'text-error' : 'text-neutral-400'
                        )}>{s.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirement IV: Route optimization for collection trucks */}
                  {s.status === 'IN TRANSIT' && (
                    <div className="flex items-center justify-between px-3 py-2 bg-tertiary/5 rounded-xl border border-tertiary/10">
                        <div className="flex items-center gap-2">
                            <Navigation size={12} className="text-tertiary" />
                            <span className="text-[9px] font-bold text-tertiary uppercase">Optimized Path Active</span>
                        </div>
                        <span className="text-[9px] font-black text-neutral-400">ETA SAVING: 14 MIN</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-black/5 text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">GPS relay data is simulated — real coordinates require IoT integration</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveTrackingPanel;
