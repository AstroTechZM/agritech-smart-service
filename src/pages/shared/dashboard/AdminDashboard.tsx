import React, { useMemo, useState } from 'react';
import { 
    Calendar, 
    Download, 
    ChevronRight, 
    TrendingUp, 
    AlertCircle, 
    Truck, 
    Wallet as WalletIcon,
    Package,
    Users,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { User } from '@/src/types';
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services';
import { useFarmers } from '@/src/context/FarmerContext';
import { APP_CONFIG } from '@/src/constants';
import PageHeader from '@/src/components/ui/PageHeader';
import StatCard from '@/src/components/ui/StatCard';
import DataTable from '@/src/components/ui/DataTable';
import { toast } from 'sonner';

interface AdminDashboardProps {
  user: User | null;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const { data: stats, isLoading: isStatsLoading } = useApi(api.fetchAdminStats);
  const { data: payments, isLoading: isPaymentsLoading } = useApi(api.fetchPayments);
  const { data: intake, isLoading: isIntakeLoading } = useApi(api.fetchDailyIntake);
  const { farmers } = useFarmers();

  const [selectedDepot, setSelectedDepot] = useState<string | null>(null);

  const isLoading = isStatsLoading || isPaymentsLoading || isIntakeLoading;

  // 1. DYNAMIC DATA AGGREGATION
  const dashboardData = useMemo(() => {
    if (!payments || !farmers) return null;

    const approved = payments.filter(p => p.status === 'APPROVED');
    const pending = payments.filter(p => p.status === 'PENDING');
    
    // Sort payments by recency for the live feed
    const recentActivity = [...payments]
        .sort((a, b) => (a.id > b.id ? -1 : 1))
        .slice(0, 5);

    return {
        totalFarmers: farmers.length,
        totalDisbursed: approved.reduce((sum, p) => sum + p.amount, 0),
        pendingApprovals: pending.length,
        totalTonnage: intake?.tonnage || 0,
        recentActivity,
        maizeTotal: (payments || [])
            .filter(p => p.crop?.toLowerCase().includes('maize'))
            .reduce((sum, p) => sum + (p.qty * 50), 0) / 1000,
        soyaTotal: (payments || [])
            .filter(p => p.crop?.toLowerCase().includes('soya'))
            .reduce((sum, p) => sum + (p.qty * 50), 0) / 1000,
    };
  }, [payments, farmers, intake]);

  const fraudColumns = [
    { 
      header: 'Farmer/Entity', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center text-error">
                <AlertCircle size={14} />
            </div>
            <div>
                <p className="font-bold text-xs">{row.nrc}</p>
                <p className="text-[10px] text-neutral-400">{row.dealer}</p>
            </div>
        </div>
      )
    },
    { 
      header: 'Flag Reason', 
      accessor: (row: any) => (
        <span className="text-[10px] font-bold text-error bg-error-container/30 px-2 py-0.5 rounded-full border border-error/10 uppercase">
          {row.reason}
        </span>
      )
    },
    { 
      header: 'Timestamp', 
      accessor: 'time' as const,
      className: 'text-xs text-neutral-400'
    },
    { 
      header: 'Action', 
      accessor: (row: any) => (
        <button 
            onClick={() => toast.info(`Reviewing flag for ${row.nrc}...`)}
            className="text-[10px] font-black uppercase text-primary hover:underline"
        >
            Review
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="FRA Command Center"
        subtitle={`${user?.district || 'Lusaka Central'} District Control • LIVE OPERATIONS`}
        actions={
          <div className="flex gap-2">
            <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary" size={16} />
                <input 
                    placeholder="Search entities..." 
                    className="bg-surface-container-high pl-10 pr-4 py-2.5 rounded-full text-xs font-medium w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90">
              <Download size={16} /> Master Report
            </button>
          </div>
        }
      />

      {/* CORE KPI COMMAND BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            label="Farmers Registered" 
            value={dashboardData?.totalFarmers.toLocaleString() || '---'} 
            icon={Users}
            trend="+12% vs last season"
            isLoading={isLoading}
        />
        <StatCard 
            label="Total Tonnage Collected" 
            value={`${dashboardData?.totalTonnage.toFixed(1)} MT`} 
            icon={Package}
            trend="Active Harvest"
            isLoading={isLoading}
        />
        <StatCard 
            label="Total Disbursed (ZMW)" 
            value={`ZMW ${dashboardData?.totalDisbursed.toLocaleString()}`} 
            icon={WalletIcon}
            trend="Live Payouts"
            isLoading={isLoading}
        />
        <StatCard 
            label="Pending Approvals" 
            value={dashboardData?.pendingApprovals.toString() || '0'} 
            icon={AlertCircle}
            urgent={dashboardData && dashboardData.pendingApprovals > 0}
            trend="Action Required"
            isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
            {/* DEPOT CAPACITY MONITOR */}
            <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-black/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold font-headline text-neutral-900">Depot Inventory Levels</h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Live Storage Capacity</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-surface-container-low rounded-xl text-neutral-400"><Filter size={16} /></button>
                        <button className="p-2 bg-surface-container-low rounded-xl text-neutral-400"><Download size={16} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {[
                        { id: 'choma', name: 'Choma Central', capacity: 85, color: 'bg-primary' },
                        { id: 'kalomo', name: 'Kalomo North', capacity: 62, color: 'bg-primary/80' },
                        { id: 'batoka', name: 'Batoka Siding', capacity: 31, color: 'bg-tertiary' },
                        { id: 'monze', name: 'Monze Hub', capacity: 94, color: 'bg-error' },
                    ].map((depot) => (
                        <motion.div 
                            key={depot.id} 
                            onClick={() => setSelectedDepot(selectedDepot === depot.id ? null : depot.id)}
                            className={cn(
                                "space-y-3 p-4 rounded-3xl transition-all cursor-pointer border border-transparent",
                                selectedDepot === depot.id ? "bg-primary/5 border-primary/10 shadow-inner" : "hover:bg-black/5"
                            )}
                        >
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-sm">{depot.name}</span>
                                <span className={cn(
                                    "text-[10px] font-black uppercase",
                                    depot.capacity > 90 ? "text-error" : "text-neutral-400"
                                )}>{depot.capacity}% FULL</span>
                            </div>
                            <div className="h-4 bg-surface-container-low rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${depot.capacity}%` }}
                                    className={cn("h-full rounded-full transition-all duration-1000", depot.color)}
                                />
                            </div>
                            <AnimatePresence>
                                {selectedDepot === depot.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="pt-2"
                                    >
                                        <div className="grid grid-cols-2 gap-4 text-[9px] font-bold uppercase text-neutral-500">
                                            <div>
                                                <p className="opacity-60">Maize Stock</p>
                                                <p className="text-neutral-900">{(depot.capacity * 12).toLocaleString()} Bags</p>
                                            </div>
                                            <div>
                                                <p className="opacity-60">Last Intake</p>
                                                <p className="text-neutral-900">4 mins ago</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* LIVE OPERATIONAL FEED */}
            <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-black/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-headline text-neutral-900">Live Operational Feed</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-success uppercase tracking-widest">System Online</span>
                    </div>
                </div>
                <div className="space-y-4">
                    {dashboardData?.recentActivity.map((activity, i) => (
                        <div 
                            key={activity.id} 
                            className="flex items-center justify-between p-4 bg-surface-container-low/30 rounded-2xl border border-black/5 hover:border-primary/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2 rounded-xl bg-white shadow-sm",
                                    activity.status === 'APPROVED' ? "text-success" : "text-primary"
                                )}>
                                    {activity.status === 'APPROVED' ? <WalletIcon size={18} /> : <Package size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-700">
                                        {activity.status === 'APPROVED' ? 'Payment Approved' : 'New Intake Recorded'}
                                    </p>
                                    <p className="text-[10px] text-neutral-400 font-medium">
                                        Farmer: {activity.name} • {activity.qty} Bags {activity.crop}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase">{i === 0 ? 'Just Now' : `${i * 3}m ago`}</p>
                                <ChevronRight size={14} className="ml-auto text-neutral-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* CROP DISTRIBUTION & TRENDS */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary-container p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-black font-headline mb-6">Crop Breakdown</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold opacity-80 mb-2 uppercase tracking-widest">
                                <span>WHITE MAIZE</span>
                                <span>{dashboardData ? ((dashboardData.maizeTotal / (dashboardData.maizeTotal + dashboardData.soyaTotal || 1)) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full p-0.5">
                                <div className="h-full bg-white rounded-full shadow-sm" style={{ width: '85%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold opacity-80 mb-2 uppercase tracking-widest">
                                <span>SOYBEANS</span>
                                <span>{dashboardData ? ((dashboardData.soyaTotal / (dashboardData.maizeTotal + dashboardData.soyaTotal || 1)) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full p-0.5">
                                <div className="h-full bg-tertiary-fixed rounded-full shadow-sm" style={{ width: '15%' }} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Current FRA Buying Price</p>
                            <p className="text-3xl font-black font-headline">ZMW 5.60 <span className="text-sm font-medium opacity-60">/KG</span></p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                            <TrendingUp size={28} />
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-error/10 text-error rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold font-headline text-neutral-900">Fraud Hotspots</h3>
                </div>
                    <div className="space-y-4">
                    {(stats?.fraudAlerts ?? []).slice(0, 3).map((alert: any, i: number) => (
                        <div 
                            key={i} 
                            className="p-4 bg-error/5 rounded-2xl border border-error/10 hover:bg-error/10 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-xs font-bold text-neutral-900">{alert.dealer}</p>
                                <span className="text-[8px] font-black bg-error/20 text-error px-1.5 py-0.5 rounded">HIGH</span>
                            </div>
                            <p className="text-[10px] text-error font-bold uppercase mt-1 tracking-tight">{alert.reason}</p>
                            <div className="mt-4 flex justify-between items-center pt-3 border-t border-error/10">
                                <span className="text-[10px] text-neutral-400 font-bold">{alert.time}</span>
                                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                    Investigate <ArrowUpRight size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-2xl bg-surface-container-low text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:bg-black/5 transition-all">
                    View Alert Center
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
