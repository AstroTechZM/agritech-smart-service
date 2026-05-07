/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. IMPORTS & HOOKS: 
 *    - 'useState' is a "Hook." It allows the component to "remember" things.
 *    - Think of it like a sticky note that updates whenever something changes.
 */
import React, { useState } from 'react';
import { QrCode, CheckCircle2, Wallet, AlertTriangle } from 'lucide-react'; // Visual icons
import { cn } from '@/src/lib/utils'; // Styling helper

/**
 * 2. THE COMPONENT: AgroDealerDashboard
 *    This is the main view for an Agro-Dealer.
 */
export const AgroDealerDashboard = () => {
  /**
   * 3. STATE (useState):
   *    - 'isRedeeming' is the current value (starts as 'false').
   *    - 'setIsRedeeming' is the function we call to CHANGE that value.
   *    When we call 'setIsRedeeming(true)', React automatically re-draws the whole screen!
   */
  const [isRedeeming, setIsRedeeming] = useState(false);

  /**
   * 4. CONDITIONAL RENDERING (The "Gatekeeper"):
   *    If 'isRedeeming' is true, we stop here and show the Redemption Screen instead 
   *    of the dashboard. This is like a "page flip" within the same file.
   */
  if (isRedeeming) {
    return (
      <div className="p-8 text-center animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold mb-4">Voucher Redemption Screen</h2>
        <p className="text-neutral-500 mb-6">This is where the dealer would scan a QR code.</p>
        <button
          /**
           * 5. EVENT HANDLER (onClick):
           *    When the user clicks this button, 'isRedeeming' is set back to 'false'.
           *    React will immediately re-render and show the dashboard again.
           */
          onClick={() => setIsRedeeming(false)}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* TOP HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Agro-Dealer Portal</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Zambia Agro Hub Ltd</h2>
          <p className="text-sm text-neutral-500">License: AD-2024-991</p>
        </div>

        {/* ACTION BUTTON: Triggers the "Redemption" state */}
        <button
          onClick={() => setIsRedeeming(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <QrCode size={20} /> Redeem Voucher
        </button>
      </div>

      {/* STATS GRID: Summary of business performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Redemptions', value: '1,284', trend: '+12%', icon: CheckCircle2 },
          { label: 'Pending Claims', value: 'ZMW 42,500', trend: 'Processing', icon: Wallet },
          { label: 'Stock Alerts', value: '2 Low', trend: 'Action Needed', icon: AlertTriangle },
        ].map((stat) => (
          /**
           * 6. LIST RENDERING (.map):
           *    We take our list of stats and turn each one into a "Card" (div).
           */
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                {/* Dynamically rendering the icon component */}
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-xs font-bold uppercase text-neutral-500">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* STOCK SECTION */}
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
                {[
                  { name: 'D-Compound Fertilizer', stock: '450 Bags', status: 'GOOD' },
                  { name: 'Urea Fertilizer', stock: '12 Bags', status: 'LOW' },
                  { name: 'Maize Seed (10kg)', stock: '120 Packs', status: 'GOOD' },
                ].map((item) => (
                  <tr key={item.name}>
                    <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-medium">{item.stock}</td>
                    <td className="px-6 py-4">
                      {/* Using 'cn' to change colors based on stock level */}
                      <span className={cn(
                        "px-2 py-1 rounded text-[9px] font-black uppercase",
                        item.status === 'GOOD' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
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

        {/* RECENT ACTIVITY SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Recent Redemptions</h3>
            <button className="text-xs font-bold text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Mumba Chileshe', nrc: '102934/11/1', time: '2 mins ago', items: '8 Bags D-Compound' },
              { name: 'Sarah Phiri', nrc: '882103/44/1', time: '1 hour ago', items: '2 Packs Maize Seed' },
              { name: 'John Banda', nrc: '449102/22/1', time: '3 hours ago', items: '4 Bags Urea' },
            ].map((r) => (
              <div key={r.nrc} className="bg-surface-container-low p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-xs text-neutral-400">NRC: {r.nrc} • {r.items}</p>
                </div>
                <p className="text-xs font-bold text-neutral-400">{r.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgroDealerDashboard;
