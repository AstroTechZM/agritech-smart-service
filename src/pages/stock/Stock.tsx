import React, { useState } from 'react';
import { Package, Download, Plus, X, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '@/src/types';
import { api } from '@/src/services/api';
import { useApi } from '@/src/hooks/useApi';
import { toast } from 'sonner';
import PageHeader from '@/src/components/ui/PageHeader';
import Badge, { BadgeVariant } from '@/src/components/ui/Badge';
import DataTable from '@/src/components/ui/DataTable';
import StockInsights from '@/src/components/stock/StockInsights';

interface StockProps {
  role: UserRole;
}

export const Stock = ({ role }: StockProps) => {
  const isDealer = role === UserRole.AGRO_DEALER;
  const isClerk = role === UserRole.AGENT;

  const { data: stockItems, isLoading, setData: setStockItems } = useApi(api.fetchStock);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Bags');
  const [restockHistory, setRestockHistory] = useState<any[]>([]);

  const fertilizerQty = (stockItems || []).filter(i => i.name.toLowerCase().includes('fertilizer')).reduce((sum, item) => sum + item.qty, 0);
  const seedQty = (stockItems || []).filter(i => i.name.toLowerCase().includes('seed')).reduce((sum, item) => sum + item.qty, 0);
  
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

  const columns = [
    { 
      header: 'Item Name', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-primary">
            <Package size={20} />
          </div>
          <span className="font-bold text-sm">{row.name}</span>
        </div>
      ),
      skeletonWidth: '12rem'
    },
    { 
      header: 'Quantity', 
      accessor: (row: any) => (
        <>
          <span className="text-sm font-black">{row.qty}</span>
          <span className="text-[10px] font-bold text-neutral-400 ml-1 uppercase">{row.unit}</span>
        </>
      ),
      skeletonWidth: '4rem'
    },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        const variant: BadgeVariant = row.status === 'STABLE' ? 'primary' : 'error';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
      skeletonWidth: '5rem'
    },
    { 
      header: 'Action', 
      accessor: (row: any) => (
        <button 
          onClick={() => handleDelete(row.name)}
          className="p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-full transition-colors"
          title="Delete Item"
        >
          <Trash2 size={18} />
        </button>
      ),
      skeletonWidth: '2rem'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Stock Management"
        category={isClerk ? 'Depot Inventory' : isDealer ? 'Shop Inventory' : 'Regional Stock'}
        actions={
          <>
            <button 
              onClick={handleExport}
              className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-black/5 transition-colors"
            >
              <Download size={16} /> Export
            </button>
            {(isClerk || isDealer) && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Plus size={16} /> Add Stock
              </button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DataTable 
            columns={columns}
            data={stockItems || []}
            isLoading={isLoading}
            rowKey={(item) => item.name}
            emptyMessage="No stock items found."
          />
        </div>

        <div className="space-y-6">
          <StockInsights 
            isLoading={isLoading}
            fertilizerCapacity={fertilizerCapacity}
            seedAvailability={seedAvailability}
            onRestockRequest={() => setShowRestockModal(true)}
          />

          {restockHistory.length > 0 && (
            <div className="bg-surface-container-lowest p-6 rounded-[2.5rem] border border-black/5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
              <h4 className="text-sm font-bold font-headline mb-4 px-1">Restock History</h4>
              <div className="space-y-3">
                {restockHistory.map((req) => (
                  <div key={req.id} className="p-4 bg-surface-container-low rounded-2xl flex justify-between items-center group hover:bg-primary/5 transition-colors">
                    <div>
                      <p className="font-bold text-xs">{req.item}</p>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">{req.id} • {req.date}</p>
                    </div>
                    <Badge variant="primary" className="text-[7px] py-0.5">{req.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {/* RESTOCK REQUEST MODAL */}
      <AnimatePresence>
        {showRestockModal && stockItems && (() => {
          const lowItems = stockItems.filter(i => i.status === 'LOW');
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setShowRestockModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-md shadow-2xl relative border border-black/5"
              >
                <button
                  onClick={() => setShowRestockModal(false)}
                  className="absolute top-6 right-6 p-2 text-neutral-400 hover:bg-black/5 rounded-full"
                >
                  <X size={20} />
                </button>

                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error mb-1 block">Inventory Alert</span>
                  <h3 className="text-3xl font-black font-headline text-neutral-900">Request Restock</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {lowItems.length > 0
                      ? `${lowItems.length} item(s) are LOW. Confirm to request resupply.`
                      : 'All items are sufficiently stocked.'}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {lowItems.length > 0 ? lowItems.map(item => (
                    <div key={item.name} className="flex justify-between items-center p-4 bg-error/5 border border-error/10 rounded-2xl">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-neutral-400 font-bold">Current: {item.qty} {item.unit}</p>
                      </div>
                      <Badge variant="error">LOW</Badge>
                    </div>
                  )) : (
                    <div className="py-8 text-center text-neutral-400">
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="font-bold text-sm">No low-stock items found</p>
                    </div>
                  )}
                </div>

                <button
                  disabled={lowItems.length === 0}
                  onClick={() => {
                    if (!stockItems) return;
                    setStockItems(stockItems.map(i =>
                      i.status === 'LOW' ? { ...i, status: 'PENDING RESTOCK' } : i
                    ));
                    
                    // Add to history
                    const newRequests = lowItems.map(item => ({
                      id: `REQ-${Date.now()}-${item.name.substring(0,3).toUpperCase()}`,
                      item: item.name,
                      qty: 500, // Default restock qty
                      date: new Date().toLocaleDateString(),
                      status: 'REQUESTED'
                    }));
                    setRestockHistory([...newRequests, ...restockHistory]);
                    
                    setShowRestockModal(false);
                    toast.success(`Restock request submitted for ${lowItems.length} item(s).`);
                  }}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-40"
                >
                  <RefreshCw size={18} /> Confirm Restock Request
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default Stock;
