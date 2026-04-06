import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Security = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error mb-1 block">Integrity Monitoring</span>
        <h2 className="text-3xl font-black font-headline tracking-tight text-neutral-900">Security & Fraud</h2>
      </div>
      <button className="bg-error text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-error/20">
        <Shield size={16} /> Run Audit
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-error-container/10 p-8 rounded-[2.5rem] border border-error/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-error text-white rounded-2xl shadow-lg shadow-error/20">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold font-headline">Active Alerts</h4>
            <p className="text-xs text-error/80">Requiring immediate action</p>
          </div>
        </div>
        <p className="text-6xl font-black font-headline text-error">12</p>
        <div className="mt-6 pt-6 border-t border-error/10 space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>High Priority</span>
            <span className="text-error">04</span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span>Medium Priority</span>
            <span>08</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
        <h4 className="text-lg font-bold font-headline mb-6">Recent Anomalies</h4>
        <div className="space-y-4">
          {[
            { msg: 'Multiple redemption attempts from same IP', loc: 'Kitwe', time: '10m ago', severity: 'HIGH' },
            { msg: 'NRC validation failure threshold exceeded', loc: 'Lusaka', time: '45m ago', severity: 'MED' },
            { msg: 'GPS mismatch on mobile redemption', loc: 'Choma', time: '2h ago', severity: 'LOW' },
          ].map((alert, i) => (
            <div key={i} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between group hover:bg-error/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  alert.severity === 'HIGH' ? "bg-error" : alert.severity === 'MED' ? "bg-tertiary" : "bg-primary"
                )} />
                <div>
                  <p className="text-sm font-bold">{alert.msg}</p>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">{alert.loc} • {alert.time}</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-primary uppercase border-b border-primary opacity-0 group-hover:opacity-100 transition-opacity">Investigate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Security;
