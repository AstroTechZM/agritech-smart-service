/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. IMPORTS: These are like "buying tools from a hardware store." 
 *    We bring in pieces of code from other files (like icons from 'lucide-react') 
 *    so we don't have to build everything from scratch.
 */
import React, { useState } from 'react';
import { Package, Download, Plus, MoreVertical, X, Trash2, Loader2 } from 'lucide-react'; // Icons for the UI
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '@/src/lib/utils'; // A utility to combine CSS class names easily
import { UserRole } from '@/src/types'; // Information about the type of user (Admin, Dealer, etc.)
import { api } from '@/src/services/api';
import { useApi } from '@/src/hooks/useApi';

/**
 * 2. INTERFACE (TypeScript):
 *    This is like a "Recipe" or a "Contract." It tells React exactly what kind of 
 *    information this component expects to receive. Here, we expect a 'role'.
 */
interface StockProps {
  role: UserRole;
}

/**
 * 3. THE COMPONENT (Stock):
 *    In React, a "Component" is a self-contained piece of the website. 
 *    Think of it like a "Lego block." This specific block handles the "Stock Management" screen.
 * 
 *    - 'role' is a "Prop" (short for Property). It's like a parameter passed to a function.
 */
export const Stock = ({ role }: StockProps) => {
  // 4. LOGIC: We calculate things here before showing them to the user.
  const isDealer = role === UserRole.AGRO_DEALER;
  const isClerk = role === UserRole.AGENT;

  const { data: stockItems, isLoading, setData: setStockItems } = useApi(api.fetchStock);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Bags');

  // Calculate dynamic capacity percentages based on keywords in item names
  const fertilizerQty = (stockItems || []).filter(i => i.name.toLowerCase().includes('fertilizer')).reduce((sum, item) => sum + item.qty, 0);
  const seedQty = (stockItems || []).filter(i => i.name.toLowerCase().includes('seed')).reduce((sum, item) => sum + item.qty, 0);
  
  // Assume max capacities for the demo (1000 for fertilizer, 500 for seeds)
  const fertilizerCapacity = Math.min(Math.round((fertilizerQty / 1000) * 100), 100);
  const seedAvailability = Math.min(Math.round((seedQty / 500) * 100), 100);

  const handleExport = () => {
    if (!stockItems) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Item Name,Quantity,Unit,Status\n"
      + stockItems.map(i => `${i.name},${i.qty},${i.unit},${i.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (name: string) => {
    if (!stockItems) return;
    setStockItems(stockItems.filter(item => item.name !== name));
  };

  const handleAddStock = () => {
    if (!newItemName || !newItemQty || !stockItems) return;
    const qty = parseInt(newItemQty);
    const newItem = {
      name: newItemName,
      qty,
      unit: newItemUnit,
      status: qty > 50 ? 'STABLE' : 'LOW'
    };
    setStockItems([newItem, ...stockItems]);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemQty('');
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Loading Warehouse Data...</p>
      </div>
    );
  }

  /**
   * 6. THE RETURN STATEMENT (JSX):
   *    This looks like HTML, but it's actually "JSX." It describes what the UI 
   *    should look like. React converts this into real HTML for the browser.
   */
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION: Title and Action Buttons */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {/* CONDITIONAL RENDERING: "If this, show that." */}
            {isClerk ? 'Depot Inventory' : isDealer ? 'Shop Inventory' : 'Regional Stock'}
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Stock Management</h2>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-black/5 transition-colors"
          >
            <Download size={16} /> Export
          </button>
          
          {/* MORE CONDITIONAL RENDERING: Only show "Add Stock" for Clerks or Dealers */}
          {(isClerk || isDealer) && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus size={16} /> Add Stock
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN TABLE SECTION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Item Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Quantity</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {/**
                   * 7. MAPPING: This is how we loop through the 'stockItems' list.
                   *    For every item in the list, we create a new table row (<tr>).
                   *    'key' is a unique ID so React can track each row.
                   */}
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
                          // Dynamic styling based on stock status
                          item.status === 'STABLE' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDelete(item.name)}
                          className="p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-full transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDEBAR SECTION: Insights */}
        <div className="space-y-6">
          <div className="bg-primary-container p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
            <h4 className="text-lg font-bold font-headline mb-4">Stock Insights</h4>
            <div className="space-y-6">
              {/* Progress Bar 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Fertilizer Capacity</span>
                  <span>{fertilizerCapacity}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${fertilizerCapacity}%` }} />
                </div>
              </div>
              
              {/* Progress Bar 2 */}
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
              onClick={() => alert("Restock request has been sent successfully!")}
              className="w-full mt-8 bg-white text-primary py-3 rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-white/20"
            >
              Request Restock
            </button>
          </div>
        </div>
      </div>

      {/* ADD STOCK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-md shadow-2xl relative border border-black/5"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:bg-black/5 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Inventory</span>
                <h3 className="text-3xl font-black font-headline text-neutral-900">Add Stock</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-neutral-500">Item Name</label>
                  <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Tomato Seeds"
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-500">Quantity</label>
                    <input 
                      type="number" 
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-500">Unit</label>
                    <select 
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>Bags</option>
                      <option>Packs</option>
                      <option>Bottles</option>
                      <option>Kg</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleAddStock}
                  className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                >
                  <Plus size={20} /> Save Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 8. EXPORT: This makes the component available to be used in other files.
export default Stock;
