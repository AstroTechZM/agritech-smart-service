import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Security = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [anomalies, setAnomalies] = useState([
    { id: 1, msg: 'Multiple redemption attempts from same IP', loc: 'Kitwe', time: '10m ago', severity: 'HIGH' },
    { id: 2, msg: 'NRC validation failure threshold exceeded', loc: 'Lusaka', time: '45m ago', severity: 'MED' },
    { id: 3, msg: 'GPS mismatch on mobile redemption', loc: 'Choma', time: '2h ago', severity: 'LOW' },
  ]);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          const newAnomaly = {
            id: Date.now(),
            msg: 'Suspicious voucher batch detected',
            loc: 'Ndola',
            time: 'Just now',
            severity: 'HIGH'
          };
          setAnomalies([newAnomaly, ...anomalies]);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleInvestigate = (id: number) => {
    setAnomalies(anomalies.filter(a => a.id !== id));
    alert('Security anomaly has been flagged for manual investigation and temporarily suppressed.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error mb-1 block">Integrity Monitoring</span>
          <h2 className="text-3xl font-black font-headline tracking-tight text-neutral-900">Security & Fraud</h2>
        </div>
        <button 
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="bg-error text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-error/20 disabled:opacity-50 transition-all"
        >
          {isAuditing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield size={16} />}
          {isAuditing ? `Auditing ${auditProgress}%` : 'Run Audit'}
        </button>
      </div>

      {isAuditing && (
        <div className="w-full bg-error/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${auditProgress}%` }}
            className="h-full bg-error"
          />
        </div>
      )}

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
          <p className="text-6xl font-black font-headline text-error">{anomalies.length < 10 ? `0${anomalies.length}` : anomalies.length}</p>
          <div className="mt-6 pt-6 border-t border-error/10 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span>High Priority</span>
              <span className="text-error">{anomalies.filter(a => a.severity === 'HIGH').length}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span>Medium Priority</span>
              <span>{anomalies.filter(a => a.severity === 'MED').length}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
          <h4 className="text-lg font-bold font-headline mb-6">Recent Anomalies</h4>
          <div className="space-y-4">
            {anomalies.map((alert) => (
              <div key={alert.id} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between group hover:bg-error/5 transition-colors">
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
                <button 
                  onClick={() => handleInvestigate(alert.id)}
                  className="text-[10px] font-black text-primary uppercase border-b border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Investigate
                </button>
              </div>
            ))}
            {anomalies.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No active anomalies found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
