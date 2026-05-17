import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Ticket, Package, CheckCircle2, ChevronRight, ArrowRight, Sprout } from 'lucide-react';
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services';
import { useWallet } from '@/src/context/WalletContext';
import { LOGIC_CONSTANTS, MOCK_DEFAULTS } from '@/src/constants';
import { User } from '@/src/types';
import { cn, safeArray } from '@/src/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * 2. COMPONENT: FarmerDashboard
 *    This is the main screen a Farmer sees when they log in.
 */
interface FarmerDashboardProps {
  user: User | null;
}

export const FarmerDashboard = ({ user }: FarmerDashboardProps) => {
  // 'navigate' is our function for jumping to other pages like '/wallet'
  const navigate = useNavigate();
  const { balance, isLoading: isWalletLoading } = useWallet();
  const { data: insights, isLoading: isInsightsLoading } = useApi(api.fetchInsights);
  const { data: vouchers, isLoading: isVouchersLoading } = useApi(api.fetchVouchers);
  const { data: deliveries, isLoading: isDeliveriesLoading } = useApi(api.fetchDeliveries);

  const isLoading = isWalletLoading || isInsightsLoading || isVouchersLoading || isDeliveriesLoading;

  const safeBalance = Number.isFinite(balance) ? balance : 0;
  const formattedBalance = safeBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });

  // Get the latest insight and voucher
  const latestInsight = insights?.[0];
  const voucherList = safeArray(vouchers);
  const activeVoucher = voucherList.find(v => v.status === 'ACTIVE') || voucherList[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Zambia Ministry of Agriculture</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">{user?.name || MOCK_DEFAULTS.FARMER_NAME}</h2>
        </div>
      </div>

      {/* 3. LAYOUT (Grid): 
          We use 'grid' to put things side-by-side. 
          'md:grid-cols-3' means 3 columns on medium screens (laptops), but 1 column on phones. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 primary-gradient p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Farmer Wallet Balance</span>
              <Wallet size={24} className="opacity-80" />
            </div>
            {isLoading ? (
              <div className="h-12 w-64 opacity-20">
                <Skeleton height="100%" baseColor="#ffffff" highlightColor="#ffffff80" />
              </div>
            ) : (
              <h3 className="text-5xl font-black font-headline">ZMW {formattedBalance}</h3>
            )}
            <button
              onClick={() => navigate('/wallet')}
              className="w-full bg-white/20 backdrop-blur-md border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all font-headline"
            >
              Withdrawal to Airtel Money <ArrowRight size={18} />
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
              <p className="text-[10px] font-bold uppercase text-neutral-500">FRA Buying Price</p>
              {isLoading ? (
                <div className="h-7 w-32 mt-1 mb-1">
                  <Skeleton height="100%" />
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black font-headline">ZMW {LOGIC_CONSTANTS.FRA_BUYING_PRICE.toFixed(2)}</p>
                  <span className="text-[10px] text-primary font-bold">{LOGIC_CONSTANTS.FRA_PRICE_TREND}</span>
                </div>
              )}
              <p className="text-[10px] text-neutral-400">per {LOGIC_CONSTANTS.FRA_UNIT} ({LOGIC_CONSTANTS.FRA_CROP})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Advice Banner */}
      {isLoading ? (
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 shrink-0"><Skeleton height="100%" borderRadius="1rem" /></div>
          <div className="flex-1 space-y-2 w-full">
            <Skeleton width="8rem" height="1rem" className="mx-auto md:mx-0 block" />
            <Skeleton width="75%" height="1.5rem" className="mx-auto md:mx-0 block" />
            <Skeleton width="100%" height="1rem" className="mx-auto md:mx-0 block" />
          </div>
          <Skeleton width="8rem" height="2.5rem" borderRadius="0.75rem" />
        </div>
      ) : (
        <div 
          onClick={() => navigate('/production')}
          className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 group cursor-pointer hover:bg-primary/10 transition-all"
        >
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
            <Sprout size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded uppercase tracking-widest">Priority Advice</span>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Seasonal Recommendations</p>
            </div>
            <h3 className="text-lg font-bold leading-tight">{latestInsight?.title || 'No recent insights'}</h3>
            <p className="text-sm text-neutral-600 font-medium mt-1 line-clamp-2">{latestInsight?.content || 'Check back later for seasonal recommendations.'}</p>
          </div>
          <button
            className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            View Full Guide <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Financial Activity & Deliveries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <section className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Ticket size={20} className="text-primary" />
              Active Voucher Status
            </h3>
            <button onClick={() => navigate('/vouchers')} className="text-xs font-bold text-primary">Details</button>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton width="8rem" height="1.5rem" />
                    <Skeleton width="10rem" height="1rem" />
                  </div>
                  <Skeleton width="4rem" height="1.25rem" borderRadius="1rem" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <Skeleton width="5rem" height="1rem" />
                    <Skeleton width="6rem" height="2rem" />
                  </div>
                  <Skeleton width="8rem" height="1rem" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-bold text-lg text-neutral-900">{activeVoucher?.type || 'No active voucher'}</p>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Voucher ID: #{activeVoucher?.id || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-widest border border-primary/20">
                      {activeVoucher?.status || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-neutral-500">Allocation</p>
                    <p className="text-2xl font-black text-primary">{activeVoucher?.allocation || '---'}</p>
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Expires: {activeVoucher?.expiryDate || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="lg:col-span-6 space-y-4">
          {/* 4. MOCK DATA:
              In a real app, this data would come from a database. 
              For now, we use MOCK_DELIVERIES[0] to grab the first item from our fake list. */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2 text-neutral-900">
              <Package size={20} className="text-primary" />
              Last Delivery Record
            </h3>
            <button onClick={() => navigate('/deliveries')} className="text-xs font-bold text-primary">History</button>
          </div>
          {isLoading ? (
            <div className="bg-surface-container-low p-4 rounded-[2rem] flex gap-4 items-center border border-black/5">
              <div className="w-16 h-16"><Skeleton height="100%" borderRadius="1rem" /></div>
              <div className="flex-1 space-y-2">
                <Skeleton width="8rem" height="1.25rem" />
                <Skeleton width="10rem" height="1rem" />
                <Skeleton width="6rem" height="1rem" />
              </div>
            </div>
          ) : deliveries && deliveries.length > 0 ? (
            <div
              onClick={() => navigate('/deliveries')}
              className="bg-surface-container-low p-4 rounded-[2rem] flex gap-4 items-center cursor-pointer hover:bg-surface-container-lowest transition-all hover:shadow-sm group border border-black/5"
            >
              <div className="w-16 h-16 bg-surface-container-high rounded-2xl overflow-hidden flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Package size={32} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-neutral-900">{deliveries[0].depot}</p>
                <p className="text-xs text-neutral-500 font-medium">{deliveries[0].produceType} • {deliveries[0].weight}</p>
                <div className="flex items-center gap-1 mt-1 text-primary">
                  <CheckCircle2 size={12} />
                  <span className="text-xs font-bold uppercase tracking-widest">Delivered: {deliveries[0].date}</span>
                </div>
              </div>
              <div className="text-neutral-400 group-hover:text-primary transition-colors pr-2">
                <ChevronRight size={20} />
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-neutral-500 py-4">No deliveries yet</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FarmerDashboard;
