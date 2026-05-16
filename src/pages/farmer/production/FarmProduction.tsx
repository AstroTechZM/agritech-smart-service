/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. NESTED MAPPING:
 *    - Sometimes we have a list inside another list. 
 *    - We use .map() twice: once for the main category and once for the items inside.
 */
import React, { useState } from 'react';
import {
  Sprout,
  History,
  TrendingUp,
  Calendar,
  AlertCircle,
  ChevronRight,
  Plus,
  Info,
  CheckCircle2,
  Leaf,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useApi } from '@/src/hooks/useApi';
import { api } from '@/src/services';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'sonner';

/**
 * 2. COMPONENT: FarmProduction
 *    Tracks crop growth, yields, and agronomy advice.
 */
export const FarmProduction = () => {
  const navigate = useNavigate();
  // 3. MULTIPLE STATES: 
  //    - 'selectedSeason' tracks which year we are looking at.
  //    - 'selectedProduction' tracks which crop record is clicked for details.
  const [selectedSeason, setSelectedSeason] = useState('2025-2026');
  const [selectedProduction, setSelectedProduction] = useState<any>(null);
  
  const { data: insightsData, isLoading: isLoadingInsights } = useApi(api.fetchInsights);
  const { data: productionData, isLoading: isLoadingProduction, setData: setProductionData } = useApi(api.fetchFarmProduction);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [harvestForm, setHarvestForm] = useState({
    crop: 'Maize (White)',
    area: '',
    yield: '',
    grade: 'A',
    moisture: ''
  });

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestForm.area || !harvestForm.yield) {
        toast.error("Please fill in all required fields.");
        return;
    }

    const newRecord = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      crop: harvestForm.crop,
      season: selectedSeason,
      area: parseFloat(harvestForm.area),
      harvestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      yield: parseInt(harvestForm.yield),
      status: 'SOLD',
      grade: harvestForm.grade,
      moisture: harvestForm.moisture || '12.5%'
    };

    if (productionData) {
        setProductionData([newRecord, ...productionData]);
    }
    
    setShowLogModal(false);
    setHarvestForm({
        crop: 'Maize (White)',
        area: '',
        yield: '',
        grade: 'A',
        moisture: ''
    });
    toast.success(`Harvest record added to your farm history.`);
  };

  const productionItems = productionData ?? [];

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Crop,Season,Area (Ha),Harvest Date,Yield (KG),Status\n"
      + productionItems.map(p => `${p.id},${p.crop},${p.season},${p.area},${p.harvestDate},${p.yield},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `farm_production_report_${selectedSeason}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data for the summary boxes at the top
  const stats = [
    { label: 'Total Area', value: '2.5 Ha', icon: Sprout, color: 'text-primary' },
    { label: 'Current Yield Est.', value: '6,250 kg', icon: TrendingUp, color: 'text-tertiary' },
    { label: 'Growth Status', value: 'Healthy', icon: Leaf, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Private Farm Records</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Farm Production</h2>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Log New Harvest
        </button>
      </div>

      {/* STATS GRID: Summary overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mb-4", stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* AGRONOMY INSIGHTS SECTION */}
        <div className="lg:col-span-12 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-[3rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Info size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">Expert Insights</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoadingInsights ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skel-ins-${i}`} className="p-6 rounded-[2rem] border bg-surface-container-low border-black/5">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton width="4rem" height="1rem" borderRadius="1rem" />
                      <Skeleton width="5rem" height="1rem" />
                    </div>
                    <Skeleton width="80%" height="1.25rem" className="mb-2 block" />
                    <Skeleton count={2} className="mb-4" />
                    <div className="flex gap-2">
                      <Skeleton width="3rem" height="1rem" borderRadius="0.5rem" />
                      <Skeleton width="4rem" height="1rem" borderRadius="0.5rem" />
                    </div>
                  </div>
                ))
              ) : (
                (insightsData || []).map((insight) => (
                  <div
                    key={insight.id}
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all hover:shadow-md",
                      // Conditional styling based on priority
                      insight.priority === 'HIGH' ? "bg-primary/5 border-primary/10" : "bg-surface-container-low border-black/5"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                        insight.priority === 'HIGH' ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500"
                      )}>
                        {insight.priority} Priority
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">{insight.category}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2 leading-tight">{insight.title}</h4>
                    <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-4">{insight.content}</p>

                    {/* NESTED MAPPING: Looping through 'tags' inside each 'insight' */}
                    <div className="flex flex-wrap gap-2">
                      {insight.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTION HISTORY SECTION */}
        <div className="lg:col-span-12">
          <div className="bg-surface-container-lowest p-8 rounded-[3rem] border border-black/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline">Production History</h3>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Historical Yields & Sales</p>
                </div>
              </div>

              {/* SEASON TOGGLE: Changes 'selectedSeason' state */}
              <div className="relative">
                <div className="hidden sm:flex bg-surface-container-low p-1 rounded-2xl">
                  {['2025-2026', '2024-2025', '2023-2024'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeason(s)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        selectedSeason === s ? "bg-white shadow-sm text-primary" : "text-neutral-400 hover:text-neutral-600"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Mobile Dropdown version of the same toggle */}
                <div className="sm:hidden relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="appearance-none bg-surface-container-low border-none rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  >
                    {['2025-2026', '2024-2025', '2023-2024'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <ChevronRight size={14} className="rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/**
               * 4. FILTERED LIST: 
               *    We only show records that match the 'selectedSeason'.
               */}
              {isLoadingProduction ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skel-prod-${i}`} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low rounded-[2rem] border border-black/5">
                    <div className="flex items-center gap-6">
                      <Skeleton width="3.5rem" height="3.5rem" borderRadius="1rem" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Skeleton width="4rem" height="1rem" />
                          <Skeleton width="3rem" height="1rem" borderRadius="0.25rem" />
                        </div>
                        <Skeleton width="6rem" height="1.25rem" className="mb-1 block" />
                        <Skeleton width="8rem" height="1rem" />
                      </div>
                    </div>
                    <div className="flex items-center gap-12 mt-4 md:mt-0">
                      <div className="text-right">
                        <Skeleton width="5rem" height="0.75rem" className="mb-1 block" />
                        <Skeleton width="6rem" height="1.25rem" />
                      </div>
                      <div className="text-right min-w-[100px]">
                        <Skeleton width="4rem" height="0.75rem" className="mb-1 block" />
                        <Skeleton width="5rem" height="1.5rem" />
                      </div>
                      <Skeleton width="2.5rem" height="2.5rem" borderRadius="9999px" />
                    </div>
                  </div>
                ))
              ) : (productionData || []).filter((p: any) => p.season === selectedSeason).length > 0 ? (
                (productionData || []).filter((p: any) => p.season === selectedSeason).map((record: any) => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedProduction(record)}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low rounded-[2rem] border border-black/5 hover:border-primary/20 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-tertiary shadow-sm group-hover:bg-tertiary group-hover:text-white transition-all">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{record.id}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                            record.status === 'SOLD' ? "bg-success/10 text-success" : "bg-primary/10 text-primary border border-primary/20"
                          )}>
                            {record.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg">{record.crop}</h4>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{record.area} Hectares planted</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Harvest Date</p>
                        <p className="text-sm font-black text-neutral-900">{record.harvestDate}</p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Net Yield</p>
                        <p className="text-xl font-black text-primary">{record.yield.toLocaleString()} KG</p>
                      </div>
                      <button className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // What to show if the filtered list is empty
                <div className="text-center py-12 bg-surface-container-low rounded-[2.5rem] border border-dashed border-black/10">
                  <AlertCircle size={48} className="mx-auto text-neutral-200 mb-4" />
                  <p className="text-neutral-400 font-bold uppercase tracking-widest">No records found for this season</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTION MODAL: Detailed View */}
      <AnimatePresence>
        {selectedProduction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProduction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-surface-container-lowest rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-black/5"
            >
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        selectedProduction.status === 'GROWING' ? "bg-primary text-white" : "bg-tertiary text-white"
                      )}>
                        {selectedProduction.status}
                      </span>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Season {selectedProduction.season}</span>
                    </div>
                    <h3 className="text-3xl font-black font-headline tracking-tight">{selectedProduction.crop}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProduction(null)}
                    className="p-3 bg-surface-container-low hover:bg-black/5 rounded-2xl transition-colors"
                  >
                    <AlertCircle size={24} className="rotate-45" />
                  </button>
                </div>

                {/**
                 * 5. COMPLEX CONDITIONAL CONTENT:
                 *    - If the crop is 'GROWING', we show a progress bar.
                 *    - If it's already harvested ('SOLD'), we show yield analytics.
                 */}
                {selectedProduction.status === 'GROWING' ? (
                  <div className="space-y-8">
                    {/* Progress Bar Animation */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Growth Progress</p>
                        <p className="text-2xl font-black text-primary">{selectedProduction.progress || 65}%</p>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden p-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProduction.progress || 65}%` }}
                          className="h-full bg-primary rounded-full shadow-sm"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-neutral-400 pt-1">
                        <span>Planting</span>
                        <span>4-Leaf</span>
                        <span className="text-primary">Growth</span>
                        <span>Tasseling</span>
                        <span>Harvest</span>
                      </div>
                    </div>

                    {/* Operational Tasks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem]">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                          <AlertCircle size={20} />
                          <p className="font-black text-xs uppercase tracking-widest">Next Priority Task</p>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Top Dressing Fertilizer</h4>
                        <p className="text-xs text-neutral-600 font-medium leading-relaxed">Due in 3 days. Soil moisture levels are currently optimal for application.</p>
                      </div>
                      <div className="p-6 bg-surface-container-low rounded-[2rem] flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4 text-neutral-500">
                          <Calendar size={20} />
                          <p className="font-black text-xs uppercase tracking-widest">Last Activity</p>
                        </div>
                        <p className="font-bold">Scouting & Weeding</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Completed 2 days ago</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        // For Activity, we still just mock it or we could add another form
                        const newRecord = {
                            id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
                            crop: selectedProduction.crop,
                            season: selectedProduction.season,
                            area: selectedProduction.area,
                            harvestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                            yield: 0,
                            status: 'GROWING',
                            grade: 'N/A',
                            moisture: 'N/A'
                          };
                          if (productionData) {
                              setProductionData([newRecord, ...productionData]);
                          }
                        setSelectedProduction(null);
                        toast.success(`Farm activity logged for ${selectedProduction.crop}.`);
                      }}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                    >
                      Log Farm Activity <ChevronRight size={24} />
                    </button>
                  </div>
                ) : (
                  // Historical View (If status is not GROWING)
                  <div className="space-y-8">
                    {/* Data summary boxes */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-surface-container-low p-4 rounded-3xl text-center">
                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Net Yield</p>
                        <p className="text-lg font-black text-neutral-900">{selectedProduction.yield.toLocaleString()} KG</p>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-3xl text-center">
                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Area Cultivated</p>
                        <p className="text-lg font-black text-neutral-900">{selectedProduction.area} Ha</p>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-3xl text-center">
                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Performance</p>
                        <p className="text-lg font-black text-success">
                          {productionData && productionData.length > 1 ? `+${Math.round((productionData[0].yield / productionData[1].yield - 1) * 100)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Comparative Bar Chart inside the modal */}
                    <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-black/5 relative overflow-hidden">
                      <h4 className="text-lg font-bold mb-4 relative z-10 text-neutral-900">Yield Benchmarking</h4>
                      <div className="space-y-4 relative z-10">
                        {(productionData || []).filter((p: any) => p.crop === selectedProduction.crop).slice(0, 3).map((bar: any, idx: number) => {
                          const maxYield = Math.max(...(productionData || []).filter((p: any) => p.crop === selectedProduction.crop).map((p: any) => p.yield));
                          const percentage = (bar.yield / maxYield) * 100;
                          return (
                            <div key={bar.id} className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-neutral-400 w-8">{bar.season.split('-')[0]}</span>
                              <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  className={cn("h-full rounded-full transition-all", idx === 0 ? "bg-primary" : "bg-neutral-300")}
                                />
                              </div>
                              <span className="text-[10px] font-black text-neutral-900 w-12 text-right">{bar.yield.toLocaleString()} KG</span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Background watermark icon */}
                      <div className="absolute top-0 right-0 p-8 text-neutral-100 -mr-16 -mt-16">
                        <TrendingUp size={160} />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setSelectedProduction(null); navigate('/deliveries'); toast.info('Showing deliveries for this crop.'); }}
                        className="flex-1 bg-surface-container-low hover:bg-black/5 py-4 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        Logistical Data <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={handleExportReport}
                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        Export Performance Report <Info size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW HARVEST MODAL */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-black/5"
            >
              <form onSubmit={handleLogActivity} className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Production Management</span>
                    <h3 className="text-2xl font-black font-headline">Log New Harvest</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="p-3 bg-surface-container-low hover:bg-black/5 rounded-2xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Crop Type</label>
                      <select 
                        value={harvestForm.crop}
                        onChange={(e) => setHarvestForm({...harvestForm, crop: e.target.value})}
                        className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        <option>Maize (White)</option>
                        <option>Soya Beans</option>
                        <option>Sunflower</option>
                        <option>Wheat</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Area (Hectares)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 2.5"
                        value={harvestForm.area}
                        onChange={(e) => setHarvestForm({...harvestForm, area: e.target.value})}
                        className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Net Yield (KG)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5000"
                        value={harvestForm.yield}
                        onChange={(e) => setHarvestForm({...harvestForm, yield: e.target.value})}
                        className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Grade</label>
                      <select 
                        value={harvestForm.grade}
                        onChange={(e) => setHarvestForm({...harvestForm, grade: e.target.value})}
                        className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">Moisture Content (%)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12.5%"
                      value={harvestForm.moisture}
                      onChange={(e) => setHarvestForm({...harvestForm, moisture: e.target.value})}
                      className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full primary-gradient text-white py-5 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-4"
                  >
                    Confirm Harvest Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmProduction;
