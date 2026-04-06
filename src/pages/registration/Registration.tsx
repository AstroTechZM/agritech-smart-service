import React, { useState } from 'react';
import { ArrowRight, MapPin, Search, CheckCircle2, ShieldCheck, Camera, Pencil } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nrc: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    district: '',
    camp: '',
    farmSize: '',
    crops: [] as string[],
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold font-headline">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">NRC Number</label>
                <input
                  type="text"
                  placeholder="000000/00/1"
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Gender</label>
                <select className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">First Name</label>
                <input type="text" className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Last Name</label>
                <input type="text" className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
              Next: Farm Details <ArrowRight size={20} />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold font-headline">Farm & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">District</label>
                <select className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                  <option>Select District</option>
                  <option>Choma</option>
                  <option>Kasama</option>
                  <option>Chipata</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Agricultural Camp</label>
                <input type="text" className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Farm Size (Hectares)</label>
                <input type="number" className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">GPS Coordinates</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Lat, Long" className="flex-1 bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" />
                  <button className="p-4 bg-primary/10 text-primary rounded-2xl"><MapPin size={24} /></button>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
                Next: Eligibility <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold font-headline">FISP Eligibility Check</h3>
            <div className="bg-surface-container-low p-8 rounded-3xl border border-black/5 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Search size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Cross-referencing Agri-Tech Database...</p>
                  <div className="w-full bg-black/5 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full w-3/4 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-tertiary" />
                  <span className="text-sm">No duplicate NRC found</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-tertiary" />
                  <span className="text-sm">Land size verified ({'>'} 0.5 Ha)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-tertiary" />
                  <span className="text-sm">Active cooperative membership confirmed</span>
                </div>
              </div>
              <div className="p-4 bg-tertiary/10 rounded-2xl border border-tertiary/20 flex items-center justify-between">
                <span className="font-bold text-tertiary">Status: ELIGIBLE</span>
                <ShieldCheck size={24} className="text-tertiary" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button onClick={() => setStep(4)} className="flex-[2] primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
                Next: Verification <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold font-headline">Identity Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Farmer Photo</p>
                <div className="aspect-square bg-surface-container-low rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 group hover:border-primary hover:text-primary transition-all cursor-pointer">
                  <Camera size={48} className="mb-2" />
                  <p className="text-xs font-bold uppercase">Capture Photo</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Digital Signature</p>
                <div className="aspect-square bg-surface-container-low rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 group hover:border-primary hover:text-primary transition-all cursor-pointer">
                  <Pencil size={48} className="mb-2" />
                  <p className="text-xs font-bold uppercase">Sign on Screen</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button onClick={() => setStep(5)} className="flex-[2] bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
                Complete Registration <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-6 py-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
              <CheckCircle2 size={56} />
            </div>
            <div>
              <h3 className="text-3xl font-black font-headline">Registration Successful</h3>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">Farmer Mumba Chileshe has been registered and assigned Voucher ID #FISP-2026-9921.</p>
            </div>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button className="w-full primary-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20">Print Farmer ID Card</button>
              <button onClick={() => setStep(1)} className="w-full bg-surface-container-low py-4 rounded-2xl font-bold">Register Another Farmer</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Officer Portal</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Farmer Registration</h2>
          <p className="text-sm text-neutral-500">Pathway B: Manual Officer-Led Enrollment</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-1.5 rounded-full transition-all duration-500",
                step >= i ? "bg-primary" : "bg-black/5"
              )}
            />
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default Registration;
