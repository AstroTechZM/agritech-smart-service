/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. ANIMATIONS: 
 *    - 'motion' comes from 'motion/react' (Framer Motion). 
 *    - It allows us to add smooth movements and fades to our UI with very little code.
 */
import React from 'react';
import { Calendar, Download, ChevronRight } from 'lucide-react'; // Icons
import { motion } from 'motion/react'; // Animation library
import { cn } from '@/src/lib/utils'; // Styling helper

/**
 * 2. COMPONENT: AdminDashboard
 *    The main control center for District Administrators.
 */
export const AdminDashboard = () => {
  return (
    // 'animate-in' and 'fade-in' are CSS animations that run when the page loads.
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight">District Admin Dashboard</h2>
          <p className="text-sm text-neutral-500">Lusaka Central District • Friday, Oct 24, 2024</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* KPI GRID (Key Performance Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Registered Farmers', value: '42,890', trend: '+4%', color: 'primary' },
          { label: 'FISP Redemption', value: '76.4%', trend: '85% Target', color: 'primary' },
          { label: 'Active Agro-Dealers', value: '142', trend: 'Dist. Wide', color: 'primary' },
          { label: 'Fraud Alerts', value: '12', trend: 'High Priority', color: 'error', urgent: true },
          { label: 'Pathway B Pending', value: '892', trend: 'In Progress', color: 'tertiary' },
        ].map((kpi) => (
          <div key={kpi.label} className={cn(
            "bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-black/5",
            // Conditional styling: If 'urgent' is true, add a red background/border.
            kpi.urgent && "bg-error-container/20 border-error/20"
          )}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{kpi.label}</p>
            <h3 className={cn("text-2xl font-black font-headline", kpi.urgent ? "text-error" : "text-primary")}>{kpi.value}</h3>
            <p className="text-[10px] font-bold mt-1 opacity-60">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* CHARTS & HEATMAPS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Ward Redemption Chart */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline">Redemption Rate by Ward</h3>
            <button className="text-xs font-bold text-primary flex items-center gap-1">
              Full Report <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Kanyama Ward', value: 92, color: 'bg-primary' },
              { label: 'Chawama Ward', value: 74, color: 'bg-primary/80' },
              { label: 'Kabwata Ward', value: 58, color: 'bg-tertiary' },
              { label: 'Matera Ward', value: 41, color: 'bg-error' },
            ].map((ward) => (
              <div key={ward.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{ward.label}</span>
                  <span>{ward.value}%</span>
                </div>
                <div className="h-10 bg-surface-container-low rounded-2xl overflow-hidden relative">
                  {/**
                   * 3. MOTION.DIV:
                   *    This is a special <div> that can animate.
                   *    'initial={{ width: 0 }}' means it starts at 0 width.
                   *    'animate={{ width: ... }}' means it grows to the correct size.
                   */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ward.value}%` }}
                    className={cn("h-full rounded-2xl", ward.color)}
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-[10px] font-bold text-white">
                    {/* Calculation inside the UI */}
                    {Math.floor(ward.value * 150)} Redeemed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Integrity Heatmap */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <h3 className="text-xl font-bold font-headline mb-6">Stock Integrity Heatmap</h3>
          <div className="grid grid-cols-4 gap-2">
            {/**
             * 4. ARRAY.FROM:
             *    This is a trick to create a list of 12 items on the fly 
             *    even if we don't have a real list of data yet.
             */}
            {Array.from({ length: 12 }).map((_, i) => {
              // Generating random data for demonstration purposes
              const val = Math.floor(Math.random() * 100);
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-white transition-all hover:scale-105 cursor-pointer",
                    // Coloring based on the random value
                    val > 70 ? "bg-primary" : val > 30 ? "bg-tertiary" : "bg-error"
                  )}
                >
                  <span className="text-[10px] font-bold">D-{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[8px] opacity-80">{val}%</span>
                </div>
              );
            })}
          </div>

          {/* Legend Section */}
          <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-[10px] font-bold text-neutral-400">
            <span>LEGEND:</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> High</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary" /> Low</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error" /> Alert</div>
            </div>
          </div>
        </div>
      </div>

      {/* FRAUD ALERTS TABLE */}
      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        <h3 className="text-xl font-bold font-headline mb-6">Recent Fraud Alerts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">NRC</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Dealer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Flag Reason</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { nrc: '491022/11/1', dealer: 'Kasama Agro', reason: 'double-dip', time: '14:22' },
                { nrc: '338102/52/1', dealer: 'Lusaka Seeds', reason: 'GPS mismatch', time: '12:05' },
                { nrc: '110928/65/1', dealer: 'Choma Inputs', reason: 'volume anomaly', time: '09:45' },
              ].map((alert) => (
                <tr key={alert.nrc} className="hover:bg-error/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm">{alert.nrc}</td>
                  <td className="px-6 py-4 text-xs text-neutral-500">{alert.dealer}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-error bg-error-container/50 px-2 py-0.5 rounded uppercase">{alert.reason}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400">{alert.time}</td>
                  <td className="px-6 py-4">
                    <button className="text-[10px] font-black uppercase text-primary">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
