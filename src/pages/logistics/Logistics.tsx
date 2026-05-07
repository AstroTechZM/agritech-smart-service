/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. FRAGMENTS (<> ... </>):
 *    - In React, a component can only return ONE top-level element.
 *    - If you want to return two things (like a <div> and a Modal), you wrap them in 
 *      an empty tag called a "Fragment." It's like an invisible container.
 */
import React, { useState } from 'react';
import { Truck, Navigation, AlertTriangle, CheckCircle2, User as UserIcon, Map as MapIcon } from 'lucide-react'; // Icons
import { motion, AnimatePresence } from 'motion/react'; // Animation tools
import { cn } from '@/src/lib/utils'; // Styling helper
import { UserRole } from '@/src/types'; // User roles
import { MOCK_SHIPMENTS } from '@/src/data/mockData'; // Dummy data for the list

interface LogisticsProps {
  role: UserRole;
}

export const Logistics = ({ role }: LogisticsProps) => {
  const isFarmer = role === UserRole.FARMER;
  const isClerk = role === UserRole.AGENT;

  // NOTE: This is hardcoded logic for the demo.
  const assignedDepot = 'Kasama Hub'; 

  /**
   * 2. MODAL STATE:
   *    - We use this to track which shipment details to show in a "popup" (modal).
   *    - If it's 'null', no popup is shown. 
   *    - If it contains a shipment object, the popup appears!
   */
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const shipments = MOCK_SHIPMENTS;

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Supply Chain</span>
            <h2 className="text-3xl font-black font-headline tracking-tight">
              {/* CONDITIONAL TEXT: Changes based on who is looking at the page */}
              {isFarmer ? 'My Deliverables' : 'Logistics & Fleet'}
            </h2>
          </div>
          {!isClerk && (
            <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/10 transition-colors text-primary">
              <Navigation size={16} /> Live Tracking
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: List of shipments */}
          <div className="lg:col-span-8 space-y-6">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                // When clicked, we "select" this shipment to show its details in the modal
                onClick={() => setSelectedShipment(shipment)}
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md group"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Truck size={32} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{shipment.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                      shipment.status === 'IN TRANSIT' ? "bg-tertiary/10 text-tertiary" :
                        shipment.status === 'LOADING' ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-400"
                    )}>
                      {shipment.status}
                    </span>
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
            ))}
          </div>

          {/* RIGHT COLUMN: Sidebar / Fleet Search */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold font-headline mb-6">Fleet Tracking</h3>
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 text-center">Quick Search</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="e.g. ABZ 1234 or TRK-202"
                      className="w-full bg-white px-5 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-neutral-300 shadow-sm"
                    />
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mt-4">
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

      {/**
       * 3. ANIMATE PRESENCE:
       *    - This allows components to "animate out" when they are removed from the screen.
       *    - Without this, the modal would just disappear instantly.
       */}
      <AnimatePresence>
        {selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            // Clicking the backdrop closes the modal
            onClick={() => setSelectedShipment(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              /**
               * 4. STOP PROPAGATION:
               *    - This is IMPORTANT! It prevents the click on the Modal Content from 
               *      "bubbling up" to the backdrop. Without this, clicking inside the modal 
               *      would accidentally close it.
               */
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-black/5"
            >
              {/* Modal Header */}
              <div className="bg-surface-container-low p-6 py-8 border-b border-black/5 text-center relative">
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-neutral-500 transition-colors"
                >
                  <span className="text-lg font-black leading-none mb-0.5">✕</span>
                </button>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                  Transit Manifest
                </span>
                <h3 className="text-3xl font-black font-headline tracking-tight">{selectedShipment.id}</h3>
              </div>

              {/* Modal Body */}
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
                  <span className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                    selectedShipment.status === 'IN TRANSIT' ? "bg-tertiary text-white border-tertiary/20 shadow-tertiary/20" :
                      selectedShipment.status === 'LOADING' ? "bg-white text-primary border-primary/20 animate-pulse shadow-primary/10" :
                        "bg-primary text-white border-primary/20 shadow-primary/20"
                  )}>
                    {selectedShipment.status}
                  </span>
                </div>

                {/* Role-Based Actions: Only Clerks can confirm arrival at their depot */}
                {isClerk && selectedShipment.status === 'IN TRANSIT' && selectedShipment.to === assignedDepot && (
                  <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-center">Destination Actions</p>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-error/10 hover:bg-error/20 text-error px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle size={16} /> Flag Problem
                      </button>
                      <button className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
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
    </>
  );
};

// Helper Icon Component
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Logistics;
