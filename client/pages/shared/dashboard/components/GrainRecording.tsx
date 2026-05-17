import React, { useState } from 'react';
import { ArrowRight, QrCode, Search, Loader2 } from 'lucide-react';
import { APP_CONFIG, UI_CONSTANTS, MOCK_DEFAULTS } from '@/constants';
import { toast } from 'sonner';
import { useFarmers } from '@/context/FarmerContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services';

interface GrainRecordingProps {
  onBack: () => void;
  onRefresh?: () => void;
}

export const GrainRecording = ({ onBack, onRefresh }: GrainRecordingProps) => {
  const { findFarmerByNRC } = useFarmers();
  const [formData, setFormData] = useState({
    nrc: '',
    crop: MOCK_DEFAULTS.CROP_MAIZE,
    weight: '',
    moisture: '12.5',
    grade: 'Grade 1',
  });

  const [foundFarmer, setFoundFarmer] = useState<{ name: string; nrc: string } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { execute: recordIntake } = useApi(api.recordGrainIntake, { immediate: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLookup = async () => {
    if (!formData.nrc) {
      toast.error("Please enter an NRC number.");
      return;
    }

    setIsLookingUp(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const farmer = findFarmerByNRC(formData.nrc);
    
    if (farmer) {
      setFoundFarmer({ name: `${farmer.firstName} ${farmer.lastName}`, nrc: farmer.nrc });
      toast.success(`Farmer found: ${farmer.firstName}`);
    } else {
      setFoundFarmer(null);
      toast.error("Farmer not found in system. Please verify registration.");
    }
    setIsLookingUp(false);
  };

  const handleSubmit = async () => {
    if (!foundFarmer) {
      toast.error("Please lookup a valid farmer first.");
      return;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      toast.error("Please enter a valid weight.");
      return;
    }

    setIsSubmitting(true);
    try {
        await recordIntake({ 
            weight: parseFloat(formData.weight),
            nrc: foundFarmer.nrc,
            farmerName: foundFarmer.name,
            crop: formData.crop
        });
        
        // Refresh dashboard data quietly
        if (onRefresh) {
            try { await onRefresh(); } catch (e) { console.warn("Sync delayed", e); }
        }
        
        toast.success("Grain recording submitted and PRN generated!");
        onBack();
    } catch (error: any) {
        toast.error("Failed to record grain intake. Please check connection.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full">
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <h2 className="text-3xl font-black font-headline tracking-tight">Record Grain Intake</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Farmer NRC</label>
                <div className="flex gap-2">
                  <input 
                    name="nrc"
                    value={formData.nrc}
                    onChange={handleInputChange}
                    className="flex-1 bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    placeholder={UI_CONSTANTS.PLACEHOLDER_NRC} 
                  />
                  <button 
                    onClick={handleLookup}
                    disabled={isLookingUp}
                    className="bg-primary text-white px-4 rounded-2xl text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLookingUp ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    Lookup
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Crop Type</label>
                <select 
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option>{MOCK_DEFAULTS.CROP_MAIZE}</option>
                  <option>{MOCK_DEFAULTS.CROP_SOYBEANS}</option>
                  <option>Paddy Rice</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Moisture (%)</label>
                <input 
                  type="number" 
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder="12.5" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Grade</label>
                <select 
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Depot (Auto)</label>
                <input className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm opacity-60" value={APP_CONFIG.ASSIGNED_DEPOT} readOnly />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Timestamp</label>
                <input className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm opacity-60" value={new Date().toLocaleString()} readOnly />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full primary-gradient text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Submit & Generate PRN'}
          </button>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline">PRN Receipt Preview</h3>
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Draft</span>
            </div>
            <div className="border-2 border-dashed border-black/10 p-6 rounded-2xl space-y-4 font-mono text-xs">
              <div className="text-center pb-4 border-b border-dashed border-black/10">
                <p className="font-bold text-sm">{APP_CONFIG.ORGANIZATION}</p>
                <p>Purchase Receipt Note</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>PRN NO:</span><span>{MOCK_DEFAULTS.RECEIPT_PREFIX}-001</span></div>
                <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span>DEPOT:</span><span>{APP_CONFIG.ASSIGNED_DEPOT.toUpperCase()}</span></div>
              </div>
              <div className="py-2 border-y border-dashed border-black/10 space-y-1">
                <div className="flex justify-between"><span>FARMER:</span><span className="font-bold">{foundFarmer ? foundFarmer.name.toUpperCase() : '---'}</span></div>
                <div className="flex justify-between"><span>NRC:</span><span>{foundFarmer ? foundFarmer.nrc : '---'}</span></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold"><span>CROP:</span><span>{formData.crop.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>WEIGHT:</span><span>{formData.weight || '0.00'} KG</span></div>
                <div className="flex justify-between"><span>GRADE:</span><span>{formData.grade.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>MOISTURE:</span><span>{formData.moisture}%</span></div>
              </div>
              
              <div className="pt-2 border-t border-dashed border-black/10 space-y-1">
                <div className="flex justify-between text-[8px] text-neutral-400">
                    <span>UNIT PRICE (FRA):</span>
                    <span>ZMW {formData.crop.toLowerCase().includes('maize') ? '5.60' : '12.00'} / KG</span>
                </div>
                <div className="flex justify-between font-black text-primary text-sm">
                    <span>EST. PAYMENT:</span>
                    <span>ZMW {(parseFloat(formData.weight || '0') * (formData.crop.toLowerCase().includes('maize') ? 5.60 : 12.00)).toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-4 text-center">
                <QrCode size={64} className="mx-auto mb-2 opacity-20" />
                <p className="text-[8px]">Scan to verify on Agri-Tech</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrainRecording;

