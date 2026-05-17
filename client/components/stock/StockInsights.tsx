import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface StockInsightsProps {
  isLoading: boolean;
  fertilizerCapacity: number;
  seedAvailability: number;
  onRestockRequest: () => void;
}

export const StockInsights = ({ 
  isLoading, 
  fertilizerCapacity, 
  seedAvailability, 
  onRestockRequest 
}: StockInsightsProps) => {
  if (isLoading) {
    return (
      <div className="bg-primary-container p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 h-64">
        <Skeleton width="60%" height="1.5rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" className="mb-6" />
        <div className="space-y-6">
          <div>
            <Skeleton width="100%" height="0.75rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" className="mb-2" />
            <Skeleton width="100%" height="0.5rem" borderRadius="1rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" />
          </div>
          <div>
            <Skeleton width="100%" height="0.75rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" className="mb-2" />
            <Skeleton width="100%" height="0.5rem" borderRadius="1rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" />
          </div>
        </div>
        <Skeleton width="100%" height="3rem" borderRadius="1rem" baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" className="mt-8" />
      </div>
    );
  }

  return (
    <div className="bg-primary-container p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
      <h4 className="text-lg font-bold font-headline mb-4">Stock Insights</h4>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Fertilizer Capacity</span>
            <span>{fertilizerCapacity}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${fertilizerCapacity}%` }} />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Seed Availability</span>
            <span>{seedAvailability}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-tertiary-fixed-dim rounded-full transition-all duration-1000" style={{ width: `${seedAvailability}%` }} />
          </div>
        </div>
      </div>
      
      <button 
        onClick={onRestockRequest}
        className="w-full mt-8 bg-white text-primary py-3 rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-white/20"
      >
        Request Restock
      </button>
    </div>
  );
};

export default StockInsights;

