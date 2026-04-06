import React from 'react';
import { ArrowRight, QrCode } from 'lucide-react';

interface GrainRecordingProps {
  onBack: () => void;
}

export const GrainRecording = ({ onBack }: GrainRecordingProps) => {
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
                  <input className="flex-1 bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm" placeholder="000000/00/1" />
                  <button className="bg-primary text-white px-4 rounded-2xl text-xs font-bold">Lookup</button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Crop Type</label>
                <select className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm">
                  <option>White Maize</option>
                  <option>Soybeans</option>
                  <option>Paddy Rice</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Weight (kg)</label>
                <input type="number" className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm" placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Moisture (%)</label>
                <input type="number" className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm" placeholder="12.5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Grade</label>
                <select className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm">
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Depot (Auto)</label>
                <input className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm opacity-60" value="Choma Central" readOnly />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Timestamp</label>
                <input className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm opacity-60" value={new Date().toLocaleString()} readOnly />
              </div>
            </div>
          </div>

          <button className="w-full primary-gradient text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20">
            Submit & Generate PRN
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
                <p className="font-bold text-sm">FRA ZAMBIA</p>
                <p>Purchase Receipt Note</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>PRN NO:</span><span>PRN-TEMP-001</span></div>
                <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span>DEPOT:</span><span>CHOMA CENTRAL</span></div>
              </div>
              <div className="py-2 border-y border-dashed border-black/10 space-y-1">
                <div className="flex justify-between"><span>FARMER:</span><span>MUTALE KAPWEPWE</span></div>
                <div className="flex justify-between"><span>NRC:</span><span>482910/11/1</span></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold"><span>CROP:</span><span>WHITE MAIZE</span></div>
                <div className="flex justify-between"><span>WEIGHT:</span><span>420.00 KG</span></div>
                <div className="flex justify-between"><span>GRADE:</span><span>GRADE 1</span></div>
                <div className="flex justify-between"><span>MOISTURE:</span><span>12.8%</span></div>
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
