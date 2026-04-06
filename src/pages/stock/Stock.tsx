import React from 'react';
import { Package, Download, Plus, MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';

interface StockProps {
  role: UserRole;
}

export const Stock = ({ role }: StockProps) => {
  const isDealer = role === UserRole.AGRO_DEALER;
  const isClerk = role === UserRole.AGENT;

  const stockItems = [
    { name: 'D-Compound Fertilizer', qty: 450, unit: 'Bags', status: 'STABLE' },
    { name: 'Urea Fertilizer', qty: 120, unit: 'Bags', status: 'LOW' },
    { name: 'Maize Seed (10kg)', qty: 85, unit: 'Packs', status: 'STABLE' },
    { name: 'Soybean Seed (25kg)', qty: 12, unit: 'Packs', status: 'LOW' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {isClerk ? 'Depot Inventory' : isDealer ? 'Shop Inventory' : 'Regional Stock'}
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Stock Management</h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          {(isClerk || isDealer) && (
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus size={16} /> Add Stock
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Item Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Quantity</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Status</th>
                    <th className="px-6 py-4 text-[10px) font-bold uppercase tracking-widest text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {stockItems.map((item) => (
                    <tr key={item.name} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-primary">
                            <Package size={20} />
                          </div>
                          <span className="font-bold text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black">{item.qty}</span>
                        <span className="text-[10px] font-bold text-neutral-400 ml-1 uppercase">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          item.status === 'STABLE' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-container p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
            <h4 className="text-lg font-bold font-headline mb-4">Stock Insights</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Fertilizer Capacity</span>
                  <span>82%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[82%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Seed Availability</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed-dim w-[45%] rounded-full" />
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-white text-primary py-3 rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all">
              Request Restock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
