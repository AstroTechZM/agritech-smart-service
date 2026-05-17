// client/pages/shared/dashboard/FarmerDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  Ticket,
  Package,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sprout,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services';
import { User } from '@/types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock fallbacks — used when backend is not available
import mockDeliveries from '@/data/deliveries.json';
import mockVouchers from '@/data/vouchers.json';

interface FarmerDashboardProps {
  user: User | null;
}

export const FarmerDashboard = ({ user }: FarmerDashboardProps) => {
  const navigate = useNavigate();
  const { balance, isLoading: walletLoading } = useWallet();

  const { data: deliveries, isLoading: deliveriesLoading } = useApi(
    api.fetchDeliveries,
    { fallback: mockDeliveries }
  );

  const { data: vouchers, isLoading: vouchersLoading } = useApi(
    api.fetchVouchers,
    { fallback: mockVouchers }
  );

  const lastDelivery = (deliveries as any[])?.[0] || null;
  const activeVoucher =
    (vouchers as any[])?.find((v: any) => v.status === 'ACTIVE') || null;

  const formattedBalance = Number.isFinite(balance)
    ? balance.toLocaleString(undefined, { minimumFractionDigits: 2 })
    : '0.00';

  const farmerFirstName =
    user?.first_name || user?.name?.split(' ')[0] || 'Farmer';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            Zambia Ministry of Agriculture
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">
            {farmerFirstName}
          </h2>
        </div>
      </div>

      {/* WALLET + FRA PRICE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 primary-gradient p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Farmer Wallet Balance
              </span>
              <Wallet size={24} className="opacity-80" />
            </div>

            {walletLoading ? (
              <Skeleton
                width="16rem"
                height="3rem"
                baseColor="rgba(255,255,255,0.2)"
                highlightColor="rgba(255,255,255,0.4)"
              />
            ) : (
              <h3 className="text-5xl font-black font-headline">
                ZMW {formattedBalance}
              </h3>
            )}

            <button
              onClick={() => navigate('/wallet')}
              className="w-full bg-white/20 backdrop-blur-md border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all font-headline"
            >
              Withdrawal to Mobile Money <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tertiary-fixed-dim/20 rounded-2xl text-tertiary">
              <TrendingUp size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-neutral-500">
                FRA Buying Price
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-black font-headline">ZMW 280.00</p>
                <span className="text-[10px] text-primary font-bold">▲ 5%</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                per 50kg bag (White Maize)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEASONAL ADVICE BANNER */}
      <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-primary/10 transition-all">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
          <Sprout size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded uppercase tracking-widest">
              Priority Advice
            </span>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Seasonal Recommendations
            </p>
          </div>
          <h3 className="text-lg font-bold leading-tight">
            Optimal Planting Window: Maize
          </h3>
          <p className="text-sm text-neutral-600 font-medium mt-1">
            Current soil moisture levels are optimal. Consider starting sowing
            this week for better results.
          </p>
        </div>
        <button
          onClick={() => navigate('/production')}
          className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          View Full Guide <ArrowRight size={16} />
        </button>
      </div>

      {/* VOUCHER + LAST DELIVERY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Active Voucher */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Ticket size={20} className="text-primary" />
              Active Voucher Status
            </h3>
            <button
              onClick={() => navigate('/vouchers')}
              className="text-xs font-bold text-primary"
            >
              Details
            </button>
          </div>

          {vouchersLoading ? (
            <Skeleton height={120} borderRadius="1.5rem" />
          ) : activeVoucher ? (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-bold text-lg text-neutral-900">
                    {activeVoucher.type}
                  </p>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                    Voucher ID: #{activeVoucher.id}
                  </p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-widest border border-primary/20">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-500">
                    Allocation
                  </p>
                  <p className="text-2xl font-black text-primary">
                    {activeVoucher.allocation}
                  </p>
                </div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Expires: {activeVoucher.expiryDate}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-dashed border-neutral-200 text-center">
              <Ticket size={32} className="mx-auto text-neutral-300 mb-2" />
              <p className="text-sm text-neutral-400 font-bold">
                No active vouchers
              </p>
            </div>
          )}
        </section>

        {/* Last Delivery */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2 text-neutral-900">
              <Package size={20} className="text-primary" />
              Last Delivery Record
            </h3>
            <button
              onClick={() => navigate('/deliveries')}
              className="text-xs font-bold text-primary"
            >
              History
            </button>
          </div>

          {deliveriesLoading ? (
            <Skeleton height={100} borderRadius="1.5rem" />
          ) : lastDelivery ? (
            <div
              onClick={() => navigate('/deliveries')}
              className="bg-surface-container-low p-4 rounded-[2rem] flex gap-4 items-center cursor-pointer hover:bg-surface-container-lowest transition-all hover:shadow-sm group border border-black/5"
            >
              <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Package size={32} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-neutral-900">{lastDelivery.depot}</p>
                <p className="text-xs text-neutral-500 font-medium">
                  {lastDelivery.produceType} • {lastDelivery.weight}
                </p>
                <div className="flex items-center gap-1 mt-1 text-primary">
                  <CheckCircle2 size={12} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {lastDelivery.date}
                  </span>
                </div>
              </div>
              <div className="text-neutral-400 group-hover:text-primary transition-colors pr-2">
                <ChevronRight size={20} />
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low p-4 rounded-[2rem] border border-dashed border-neutral-200 text-center">
              <p className="text-sm text-neutral-400 font-bold">
                No deliveries yet
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FarmerDashboard;