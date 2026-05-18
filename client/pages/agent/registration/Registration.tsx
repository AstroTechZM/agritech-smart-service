import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Search, CheckCircle2, ShieldCheck, Camera, Pencil, X, Loader2, Printer, QrCode, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/services';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { UI_CONSTANTS, APP_CONFIG } from '@/constants';
import { useFarmers } from '@/context/FarmerContext';

export const Registration = () => {
  const [step, setStep] = useState(1);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{ status: 'IDLE' | 'ELIGIBLE' | 'INELIGIBLE', reason?: string }>({ status: 'IDLE' });
  const { addFarmer, farmers } = useFarmers();

  const [formData, setFormData] = useState({
    nrc: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    district: '',
    camp: '',
    farmSize: '',
    gps: '',
    crops: [] as string[],
  });

  const { isLoading: isRegistering, execute: registerFarmer } = useApi(api.registerFarmer, { immediate: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsCapturingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        setFormData(prev => ({ ...prev, gps: coords }));
        toast.success("GPS Coordinates captured successfully!");
        setIsCapturingGPS(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to capture location. Please enter manually.");
        setIsCapturingGPS(false);
      }
    );
  };

  const validateNRC = (nrc: string) => {
    const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;
    return nrcRegex.test(nrc);
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.nrc || !formData.firstName || !formData.lastName || !formData.gender) {
        toast.error("Please fill in all personal details.");
        return false;
      }
      if (!validateNRC(formData.nrc)) {
        toast.error("Invalid NRC format. Expected: 000000/00/1");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.district || !formData.camp || !formData.farmSize) {
        toast.error("Please fill in all farm details.");
        return false;
      }
    } else if (currentStep === 4) {
      if (!photoCaptured || !signatureCaptured) {
        toast.error("Photo and Signature are required for verification.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 2) {
        // Run real eligibility check when moving to Step 3
        checkEligibility();
      }
      setStep(prev => prev + 1);
    }
  };

  const checkEligibility = () => {
    setIsCheckingEligibility(true);
    setEligibilityResult({ status: 'IDLE' });
    
    setTimeout(() => {
      // Check for duplicate NRC
      const isDuplicate = farmers.some(f => f.nrc === formData.nrc);
      
      if (isDuplicate) {
        setEligibilityResult({ 
          status: 'INELIGIBLE', 
          reason: 'A farmer with this NRC is already registered in the FISP system.' 
        });
        toast.error("Duplicate NRC detected!");
      } else if (parseFloat(formData.farmSize) < 0.5) {
        setEligibilityResult({ 
          status: 'INELIGIBLE', 
          reason: 'Land size is below the minimum requirement for FISP eligibility (0.5 Ha).' 
        });
      } else {
        setEligibilityResult({ status: 'ELIGIBLE' });
      }
      setIsCheckingEligibility(false);
    }, 2000);
  };

  const handleCompleteRegistration = async () => {
    if (!validateStep(4)) return;
    
    try {
      const payload = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
        photo: capturedImageSrc,
        signature: capturedSignatureSrc
      };

      await registerFarmer(payload);
      // Add to global state
      addFarmer(payload);
      toast.success("Farmer registration completed successfully!");
      setStep(5);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration failed", error);
    }
  };

  // Device simulation states
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const [capturedSignatureSrc, setCapturedSignatureSrc] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);

  // Camera integration refs and logic
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.warning("Camera API requires HTTPS. Using simulation mode.");
      setUseSimulation(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach(t => t.stop());
        }
      }, 100);
    } catch (err) {
      toast.error("Could not access camera. Using simulation mode.");
      setUseSimulation(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (useSimulation) {
      setCapturedImageSrc(UI_CONSTANTS.DEFAULT_AVATAR);
      setPhotoCaptured(true);
      stopCamera();
      return;
    }

    if (videoRef.current && photoCanvasRef.current) {
      const video = videoRef.current;
      const canvas = photoCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImageSrc(dataUrl);
        setPhotoCaptured(true);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

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
                  name="nrc"
                  value={formData.nrc}
                  onChange={handleInputChange}
                  placeholder={UI_CONSTANTS.PLACEHOLDER_NRC}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
            </div>
            <button onClick={handleNext} className="w-full primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
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
                <select 
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="">Select District</option>
                  <option value="Choma">Choma</option>
                  <option value="Kasama">Kasama</option>
                  <option value="Chipata">Chipata</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Agricultural Camp</label>
                <input 
                  type="text" 
                  name="camp"
                  value={formData.camp}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Farm Size (Hectares)</label>
                <input 
                  type="number" 
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">GPS Coordinates</label>
                <div className="flex gap-2">
                  <input 
                    name="gps"
                    value={formData.gps}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Lat, Long" 
                    className="flex-1 bg-surface-container-low border border-black/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                  <button 
                    onClick={handleCaptureGPS}
                    disabled={isCapturingGPS}
                    className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    {isCapturingGPS ? <Loader2 size={24} className="animate-spin" /> : <MapPin size={24} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Primary Crops</label>
              <div className="flex flex-wrap gap-2">
                {['Maize', 'Soybeans', 'Sunflower', 'Cotton', 'Tobacco', 'Groundnuts'].map(crop => (
                  <button
                    key={crop}
                    onClick={() => {
                      const currentCrops = [...formData.crops];
                      if (currentCrops.includes(crop)) {
                        setFormData(prev => ({ ...prev, crops: currentCrops.filter(c => c !== crop) }));
                      } else {
                        setFormData(prev => ({ ...prev, crops: [...currentCrops, crop] }));
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      formData.crops.includes(crop) 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-surface-container-low text-neutral-600 border-black/5 hover:border-primary/30"
                    )}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button onClick={handleNext} className="flex-[2] primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
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
                  {isCheckingEligibility ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    {isCheckingEligibility ? "Cross-referencing Agri-Tech Database..." : "Database Check Complete"}
                  </p>
                  <div className="w-full bg-black/5 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={cn(
                      "h-full transition-all duration-1000",
                      isCheckingEligibility ? "bg-primary w-3/4 animate-pulse" : "bg-success w-full"
                    )} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {isCheckingEligibility ? (
                    <div className="w-5 h-5 bg-neutral-200 rounded-full animate-pulse" />
                  ) : (
                    <CheckCircle2 size={20} className={cn(eligibilityResult.status === 'INELIGIBLE' && formData.nrc && farmers.some(f => f.nrc === formData.nrc) ? "text-error" : "text-tertiary")} />
                  )}
                  <span className="text-sm">No duplicate NRC found</span>
                </div>
                <div className="flex items-center gap-3">
                   {isCheckingEligibility ? (
                    <div className="w-5 h-5 bg-neutral-200 rounded-full animate-pulse" />
                  ) : (
                    <CheckCircle2 size={20} className={cn(parseFloat(formData.farmSize) < 0.5 ? "text-error" : "text-tertiary")} />
                  )}
                  <span className="text-sm">Land size verified ({'>'} 0.5 Ha)</span>
                </div>
              </div>

              {!isCheckingEligibility && (
                <div className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 animate-in zoom-in-95",
                  eligibilityResult.status === 'ELIGIBLE' 
                    ? "bg-tertiary/10 border-tertiary/20 text-tertiary" 
                    : "bg-error/10 border-error/20 text-error"
                )}>
                  <div className="flex flex-col">
                    <span className="font-bold">Status: {eligibilityResult.status}</span>
                    {eligibilityResult.reason && <span className="text-[10px] font-medium opacity-80">{eligibilityResult.reason}</span>}
                  </div>
                  {eligibilityResult.status === 'ELIGIBLE' ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button 
                onClick={handleNext} 
                disabled={isCheckingEligibility || eligibilityResult.status !== 'ELIGIBLE'}
                className="flex-[2] primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
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
                {photoCaptured && capturedImageSrc ? (
                  <div className="aspect-square bg-surface-container-low rounded-3xl overflow-hidden relative border border-black/5">
                    <img src={capturedImageSrc} alt="Captured" className="w-full h-full object-cover" />
                    <button onClick={() => { setPhotoCaptured(false); setCapturedImageSrc(null); }} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md">
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-success text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={startCamera}
                    className="aspect-square bg-surface-container-low rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 group hover:border-primary hover:text-primary transition-all cursor-pointer"
                  >
                    <Camera size={48} className="mb-2 transition-transform group-hover:scale-110" />
                    <p className="text-xs font-bold uppercase">Capture Photo</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Digital Signature</p>
                {signatureCaptured && capturedSignatureSrc ? (
                  <div className="aspect-square bg-surface-container-low rounded-3xl border border-black/5 flex flex-col items-center justify-center relative overflow-hidden">
                     <img src={capturedSignatureSrc} alt="Signature" className="w-full h-full object-contain p-4" />
                     <button onClick={() => { setSignatureCaptured(false); setCapturedSignatureSrc(null); }} className="absolute top-4 right-4 p-2 bg-neutral-200 text-neutral-600 rounded-full hover:bg-neutral-300">
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-4 bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck size={12} /> Signed
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setShowSignature(true)}
                    className="aspect-square bg-surface-container-low rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 group hover:border-primary hover:text-primary transition-all cursor-pointer"
                  >
                    <Pencil size={48} className="mb-2 transition-transform group-hover:scale-110" />
                    <p className="text-xs font-bold uppercase">Sign on Screen</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="flex-1 bg-surface-container-low py-5 rounded-2xl font-bold">Back</button>
              <button 
                onClick={handleCompleteRegistration}
                disabled={isRegistering}
                className="flex-[2] bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegistering ? (
                  <>Processing... <Loader2 className="animate-spin" size={20} /></>
                ) : (
                  <>Complete Registration <CheckCircle2 size={20} /></>
                )}
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
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Farmer <span className="font-bold text-neutral-900">{formData.firstName || 'Farmer'} {formData.lastName}</span> has been registered and assigned Voucher ID #FISP-2026-{Math.floor(1000 + Math.random() * 9000)}.
              </p>
            </div>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button 
                onClick={() => {
                  toast.info("Preparing secure ID card...");
                  setTimeout(() => window.print(), 800);
                }}
                className="w-full primary-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Printer size={20} /> Print Farmer ID Card
              </button>
              <button 
                onClick={() => {
                  setFormData({
                    nrc: '',
                    firstName: '',
                    lastName: '',
                    gender: '',
                    dob: '',
                    district: '',
                    camp: '',
                    farmSize: '',
                    gps: '',
                    crops: [],
                  });
                  setPhotoCaptured(false);
                  setSignatureCaptured(false);
                  setCapturedImageSrc(null);
                  setCapturedSignatureSrc(null);
                  setStep(1);
                }} 
                className="w-full bg-surface-container-low py-4 rounded-2xl font-bold"
              >
                Register Another Farmer
              </button>
            </div>

            <div id="id-card-print" className="hidden print:block fixed top-0 left-0 w-full h-full bg-white z-[9999]">
              <div className="w-[85.6mm] h-[53.98mm] border-2 border-primary rounded-[10px] p-4 relative overflow-hidden flex bg-white mx-auto mt-20">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full" />
                    <div>
                      <h1 className="text-[10px] font-black leading-none">{APP_CONFIG.ORGANIZATION}</h1>
                      <p className="text-[6px] font-bold text-neutral-500 uppercase tracking-tighter">Farmer Digital ID</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[6px] text-neutral-400 font-bold uppercase">Name</p>
                    <p className="text-[10px] font-black uppercase leading-tight">{formData.firstName} {formData.lastName}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-[6px] text-neutral-400 font-bold uppercase">NRC</p>
                        <p className="text-[8px] font-bold">{formData.nrc}</p>
                      </div>
                      <div>
                        <p className="text-[6px] text-neutral-400 font-bold uppercase">District</p>
                        <p className="text-[8px] font-bold">{formData.district}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <QrCode size={40} className="text-black opacity-80" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-right">
                    <p className="text-[6px] text-neutral-400 font-bold uppercase">Signature</p>
                    {capturedSignatureSrc && <img src={capturedSignatureSrc} className="h-6 w-auto ml-auto invert" alt="sign" />}
                  </div>
                </div>
                <div className="w-[25mm] h-[32mm] bg-neutral-100 rounded-lg overflow-hidden border border-black/10 ml-4 self-center">
                  {capturedImageSrc && <img src={capturedImageSrc} className="w-full h-full object-cover" alt="farmer" />}
                </div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full" />
              </div>
              <style>{`
                @media print {
                  body * { visibility: hidden; }
                  #id-card-print, #id-card-print * { visibility: visible; }
                  #id-card-print { position: absolute; left: 0; top: 0; }
                }
              `}</style>
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

      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-neutral-900 p-6 rounded-[3rem] w-full max-w-md space-y-6"
            >
              <div className="flex justify-between items-center text-white">
                <h3 className="font-bold">Capture Photo</h3>
                <button onClick={stopCamera} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-[3/4] bg-black rounded-[2rem] border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                {useSimulation ? (
                  <img src={UI_CONSTANTS.DEFAULT_AVATAR} alt="feed" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                )}
                <canvas ref={photoCanvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border border-white/30 rounded-full flex items-center justify-center">
                     <div className="w-1 h-4 bg-white/50 absolute top-0" />
                     <div className="w-1 h-4 bg-white/50 absolute bottom-0" />
                     <div className="w-4 h-1 bg-white/50 absolute left-0" />
                     <div className="w-4 h-1 bg-white/50 absolute right-0" />
                  </div>
                </div>
              </div>
              <button 
                onClick={capturePhoto}
                className="w-full bg-white text-black py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Camera size={20} /> Take Photo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignature && (
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
              className="bg-surface-container-lowest p-6 rounded-[3rem] w-full max-w-md space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Provide Signature</h3>
                <button onClick={() => setShowSignature(false)} className="p-2 hover:bg-black/5 rounded-full text-neutral-500">
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-surface-container-low rounded-3xl border border-black/10 overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={250}
                  className="w-full h-[250px] cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!isDrawing && <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pointer-events-none select-none">Sign Here</p>}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    }
                  }}
                  className="flex-1 bg-surface-container-low py-4 rounded-2xl font-bold"
                >
                  Clear
                </button>
                <button 
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const dataUrl = canvas.toDataURL('image/png');
                      setCapturedSignatureSrc(dataUrl);
                    }
                    setSignatureCaptured(true);
                    setShowSignature(false);
                  }}
                  className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20"
                >
                  Save Signature
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registration;

