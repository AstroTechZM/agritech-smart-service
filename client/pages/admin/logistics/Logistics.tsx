import React, { useState } from 'react';
import { Truck, Navigation, AlertTriangle, CheckCircle2, User as UserIcon, Map as MapIcon, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { api } from '@/services';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Skeleton from 'react-loading-skeleton';
import LiveTrackingPanel from '@/components/logistics/LiveTrackingPanel';

interface LogisticsProps {
  role: UserRole;
}

export const Logistics = ({ role }: LogisticsProps) => {
  const isFarmer = role === UserRole.FARMER;
  const isClerk = role === UserRole.AGENT;

  const assignedDepot = 'Kasama Hub'; 

  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [showTrackingPanel, setShowTrackingPanel] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const { data: shipments, isLoading, setData: setShipments } = useApi(api.fetchShipments);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = (shipments || []).filter(s => 
    (s.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.vehicle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateShipmentStatus = (id: string, newStatus: string, reason?: string) => {
    if (!shipments) return;
    setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus, reason: reason || s.reason } : s));
    setSelectedShipment(null);
    setShowReasonModal(false);
    setDelayReason('');
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader 
          title={isFarmer ? 'My Deliverables' : 'Logistics & Fleet'}
          category="Supply Chain"
          actions={!isClerk && (
            <button 
              onClick={() => setShowTrackingPanel(true)}
              className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/10 transition-colors text-primary"
            >
              <Navigation size={16} /> Live Tracking
            </button>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skel-ship-${i}`} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
                  <Skeleton width="4rem" height="4rem" borderRadius="1rem" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="40%" height="1.2rem" />
                    <Skeleton width="60%" height="1.5rem" />
                    <Skeleton width="30%" height="1rem" />
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <Skeleton width="4rem" height="1rem" className="mb-2 block" />
                    <Skeleton width="3rem" height="1.5rem" />
                  </div>
                </div>
              ))
            ) : filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  onClick={() => setSelectedShipment(shipment)}
                  className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md group"
                >
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Truck size={32} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{shipment.id}</span>
                      <Badge variant={
                        shipment.status === 'IN TRANSIT' ? 'tertiary' :
                        shipment.status === 'LOADING' ? 'primary' : 
                        shipment.status === 'DELAYED' ? 'error' : 'neutral'
                      }>
                        {shipment.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-lg">{shipment.cargo}</h4>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><MapIcon size={12} /> {shipment.from}</span>
                      {!isClerk && <ArrowRight size={12} />}
                      <span className="flex items-center gap-1 text-primary"><MapIcon size={12} /> {shipment.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Estimated Arrival</p>
                    <p className="text-sm font-black text-primary">{shipment.eta}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-lowest p-12 rounded-[2rem] border border-black/5 text-center text-neutral-400 font-bold">
                No shipments found matching your search.
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold font-headline mb-6">Fleet Tracking</h3>
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 text-center">Quick Search</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. ABZ 1234 or TRK-202"
                      className="w-full bg-white px-5 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-neutral-300 shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (filteredShipments.length > 0) {
                        toast.success(`Found ${filteredShipments.length} match(es) for "${searchQuery || 'all vehicles'}".`);
                      } else {
                        toast.error('No vehicles found matching that ID or plate.');
                      }
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mt-4"
                  >
                    <Navigation size={18} className="group-hover:rotate-45 transition-transform duration-300" /> Locate Vehicle
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-bold">3 Trucks Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-tertiary rounded-full" />
                    <span className="text-xs font-bold">1 Delay Reported</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedShipment(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-black/5"
            >
              <div className="bg-surface-container-low p-6 py-8 border-b border-black/5 text-center relative">
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-neutral-500 transition-colors"
                >
                  <X size={16} />
                </button>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                  Transit Manifest
                </span>
                <h3 className="text-3xl font-black font-headline tracking-tight">{selectedShipment.id}</h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 p-4 rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Source</p>
                    <p className="font-bold text-sm">{selectedShipment.from}</p>
                    <p className="text-[10px] text-neutral-500 font-bold mt-1 flex items-center gap-1"><UserIcon size={10} /> Agnt: {selectedShipment.agent}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Destination</p>
                    <p className="font-bold text-sm text-primary">{selectedShipment.to}</p>
                    <p className="text-[10px] text-primary/70 font-bold mt-1 flex items-center gap-1"><MapIcon size={10} /> {selectedShipment.eta}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Cargo Details</span>
                    <div className="text-right">
                      <p className="text-sm font-bold">{selectedShipment.cargo}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{selectedShipment.bags} Bags Count</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Transport Vehicle</span>
                    <span className="text-sm font-bold flex items-center gap-2"><Truck size={14} className="text-primary" /> {selectedShipment.vehicle}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Dispatch Time</span>
                    <span className="text-sm font-bold">{selectedShipment.dispatched}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 pb-2 border-b border-black/5">
                  <span className="text-[11px] font-bold uppercase text-neutral-500">Current Status</span>
                  <Badge 
                    variant={
                      selectedShipment.status === 'IN TRANSIT' ? 'tertiary' :
                      selectedShipment.status === 'LOADING' ? 'primary' : 
                      selectedShipment.status === 'DELAYED' ? 'error' : 'neutral'
                    }
                    className="px-4 py-2"
                  >
                    {selectedShipment.status}
                  </Badge>
                </div>

                {selectedShipment.reason && (
                  <div className="p-4 bg-error/5 border border-error/10 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[9px] font-black uppercase text-error mb-1">Reported Issue</p>
                    <p className="text-xs font-bold text-neutral-700 italic">"{selectedShipment.reason}"</p>
                  </div>
                )}

                {isClerk && selectedShipment.status === 'IN TRANSIT' && selectedShipment.to === assignedDepot && (
                  <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-center">Destination Actions</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowReasonModal(true)}
                        className="flex-1 bg-error/10 hover:bg-error/20 text-error px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle size={16} /> Flag Problem
                      </button>
                      <button 
                        onClick={() => updateShipmentStatus(selectedShipment.id, 'DELIVERED')}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Confirm Arrival
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveTrackingPanel 
        isOpen={showTrackingPanel} 
        onClose={() => setShowTrackingPanel(false)} 
        shipments={shipments || []} 
      />

      {/* DELAY REASON MODAL */}
      <AnimatePresence>
        {showReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowReasonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-sm shadow-2xl relative border border-black/5"
            >
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error mb-1 block">Dispatch Alert</span>
                <h3 className="text-2xl font-black font-headline">Report Problem</h3>
                <p className="text-xs text-neutral-500 mt-1">Briefly explain the cause of the delay for shipment {selectedShipment?.id}.</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="e.g. Mechanical failure at Kitwe branch..."
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-error/20 h-32 resize-none"
                />
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowReasonModal(false)}
                    className="flex-1 bg-surface-container-low py-4 rounded-2xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!delayReason}
                    onClick={() => updateShipmentStatus(selectedShipment.id, 'DELAYED', delayReason)}
                    className="flex-[2] bg-error text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-error/20 disabled:opacity-50"
                  >
                    Report Delay
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Logistics;

