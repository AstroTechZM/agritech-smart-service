import React from 'react';
import { Calendar, Download, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { User } from '@/src/types';
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services/api';
import { useFarmers } from '@/src/context/FarmerContext';
import PageHeader from '@/src/components/ui/PageHeader';
import StatCard from '@/src/components/ui/StatCard';
import DataTable from '@/src/components/ui/DataTable';

interface AdminDashboardProps {
  user: User | null;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const { data: stats, isLoading } = useApi(api.fetchAdminStats);
  const { farmers } = useFarmers();

  // Dynamic calculations
  const totalFarmers = farmers.length;
  const totalHa = farmers.reduce((sum, f) => sum + (parseFloat(f.farmSize) || 0), 0);

  const fraudColumns = [
    { 
      header: 'NRC', 
      accessor: 'nrc' as const,
      className: 'font-bold text-sm'
    },
    { 
      header: 'Dealer', 
      accessor: 'dealer' as const,
      className: 'text-xs text-neutral-500'
    },
    { 
      header: 'Flag Reason', 
      accessor: (row: any) => (
        <span className="text-[10px] font-bold text-error bg-error-container/50 px-2 py-0.5 rounded uppercase">
          {row.reason}
        </span>
      ),
      skeletonWidth: '6rem'
    },
    { 
      header: 'Timestamp', 
      accessor: 'time' as const,
      className: 'text-xs text-neutral-400'
    },
    { 
      header: 'Action', 
      accessor: () => <button className="text-[10px] font-black uppercase text-primary">Review</button>,
      skeletonWidth: '4rem'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title={user?.name || 'District Admin Dashboard'}
        subtitle={`${user?.district || 'Lusaka Central'} District • Friday, Oct 24, 2024`}
        actions={
          <>
            <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
              <Calendar size={16} /> Last 30 Days
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
              <Download size={16} /> Export Data
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <StatCard key={`skel-kpi-${i}`} label="" isLoading={true} />
          ))
        ) : (
          (stats?.kpis || []).map((kpi: any) => {
            let val = kpi.value;
            if (kpi.label === 'Total Farmers') val = totalFarmers.toLocaleString();
            if (kpi.label === 'Area Coverage') val = `${totalHa.toLocaleString()} Ha`;
            
            return (
              <StatCard 
                key={kpi.label}
                label={kpi.label}
                value={val}
                trend={kpi.trend}
                urgent={kpi.urgent}
              />
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline">Redemption Rate by Ward</h3>
            <button className="text-xs font-bold text-primary flex items-center gap-1">
              Full Report <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skel-ward-${i}`} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <div className="w-24 h-4 bg-neutral-200 animate-pulse rounded" />
                    <div className="w-8 h-4 bg-neutral-200 animate-pulse rounded" />
                  </div>
                  <div className="h-10 bg-surface-container-low rounded-2xl animate-pulse" />
                </div>
              ))
            ) : (
              (stats?.wards || []).map((ward: any) => (
                <div key={ward.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{ward.label}</span>
                    <span>{ward.value}%</span>
                  </div>
                  <div className="h-10 bg-surface-container-low rounded-2xl overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ward.value}%` }}
                      className={cn("h-full rounded-2xl", ward.color)}
                    />
                    <span className="absolute inset-y-0 left-4 flex items-center text-[10px] font-bold text-white">
                      {Math.floor(ward.value * 150)} Redeemed
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <h3 className="text-xl font-bold font-headline mb-6">Stock Integrity Heatmap</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const val = Math.floor(Math.random() * 100);
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-white transition-all hover:scale-105 cursor-pointer",
                    val > 70 ? "bg-primary" : val > 30 ? "bg-tertiary" : "bg-error"
                  )}
                >
                  <span className="text-[10px] font-bold">D-{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[8px] opacity-80">{val}%</span>
                </div>
              );
            })}
          </div>
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

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-headline px-1">Recent Fraud Alerts</h3>
        <DataTable 
          columns={fraudColumns}
          data={stats?.fraudAlerts || []}
          isLoading={isLoading}
          rowKey={(alert) => alert.nrc}
          emptyMessage="No fraud alerts detected."
          skeletonRows={3}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
