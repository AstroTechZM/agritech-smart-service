import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Clock, History, Scale, Receipt, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import GrainRecording from './components/GrainRecording';
import { APP_CONFIG, LOGIC_CONSTANTS, MOCK_DEFAULTS } from '@/src/constants';

import { User } from '@/src/types';

interface AgentDashboardProps {
  user: User | null;
}

export const AgentDashboard = ({ user }: AgentDashboardProps) => {
  const navigate = useNavigate();
  const [showRecording, setShowRecording] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Local data successfully synchronized with ministry servers.');
    }, LOGIC_CONSTANTS.SYNC_TIMEOUT);
  };

  if (showRecording) {
    return <GrainRecording onBack={() => setShowRecording(false)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Assigned Depot</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">{APP_CONFIG.ASSIGNED_DEPOT}</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-tertiary-fixed-dim/20 text-tertiary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <Clock size={16} />
            OFFLINE MODE
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 disabled:opacity-50"
          >
            {isSyncing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <History size={12} />
            )}
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-black/5">
          <Package size={24} className="text-primary mb-4" />
          <p className="text-[10px] font-bold uppercase text-neutral-500">Today's Grain Intake</p>
          <p className="text-4xl font-black font-headline">142 <span className="text-lg font-medium text-neutral-400">Bags</span></p>
        </div>
        <div className="bg-primary-container p-6 rounded-3xl shadow-xl shadow-primary/10 text-white">
          <Users size={24} className="mb-4 opacity-80" />
          <p className="text-[10px] font-bold uppercase opacity-80">Pending Verifications</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-black font-headline">08</p>
            <button 
              onClick={() => navigate('/registration')}
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Verify Farmer', onClick: () => navigate('/registration') },
            { icon: Scale, label: 'Record Grain', onClick: () => setShowRecording(true) },
            { icon: Receipt, label: 'Generate PRN', onClick: () => alert('PRN Generation Service is currently being initialized...') },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-container-lowest rounded-3xl border border-black/5 hover:bg-primary/5 transition-all group"
            >
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Pending Farmer Queue</h3>
          <button onClick={() => navigate('/registration')} className="text-[10px] font-bold text-primary uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { name: MOCK_DEFAULTS.FARMER_NAME, nrc: MOCK_DEFAULTS.FARMER_NRC, weight: '420kg', crop: MOCK_DEFAULTS.CROP_MAIZE },
            { name: 'Bwalya Mwewa', nrc: '110928/65/1', weight: '1,250kg', crop: MOCK_DEFAULTS.CROP_SOYBEANS },
          ].map((item) => (
            <div key={item.nrc} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-black/5">
              <div className="w-12 h-12 bg-surface-container-high rounded-full overflow-hidden">
                <img src={`https://picsum.photos/seed/${item.nrc}/200`} alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs font-bold text-primary">{item.weight}</p>
                </div>
                <p className="text-[10px] text-neutral-400">NRC: {item.nrc}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-high rounded text-[9px] font-bold uppercase">{item.crop}</span>
                </div>
              </div>
              <button onClick={() => navigate('/registration')} className="bg-primary text-white p-2 rounded-xl">
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AgentDashboard;
