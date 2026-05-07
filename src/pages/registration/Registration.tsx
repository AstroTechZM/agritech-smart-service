/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. MULTI-STEP FORMS:
 *    - In React, we often use a "step" variable to decide which part of a form to show.
 *    - This is like a "choose your own adventure" book where the page changes based on your choices.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Search, CheckCircle2, ShieldCheck, Camera, Pencil, X } from 'lucide-react'; // Icons
import { cn } from '@/src/lib/utils'; // Styling helper
import { motion, AnimatePresence } from 'motion/react';

/**
 * 2. COMPONENT: Registration
 *    This handles the process of registering a new farmer.
 */
export const Registration = () => {
  // 3. STEP STATE: Tracks which screen the user is currently on (1, 2, 3, 4, or 5).
  const [step, setStep] = useState(1);

  // 4. COMPLEX STATE (Object):
  //    Instead of one sticky note, this is like a "Form Sheet" that holds multiple 
  //    pieces of information (name, NRC, etc.) in one place.
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

  // Device simulation states
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);

  // Camera integration refs and logic
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera API requires a secure HTTPS connection. Falling back to simulation mode.");
      setUseSimulation(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Wait for React to render the modal and video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          // If modal was closed immediately or ref failed
          stream.getTracks().forEach(t => t.stop());
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Error accessing camera. Falling back to simulation mode.");
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
      setCapturedImageSrc("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop");
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

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Canvas ref and drawing state
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

  /**
   * 5. HELPER FUNCTION (renderStep):
   *    This function uses a "switch" statement (like a multi-way fork in the road) 
   *    to return the correct JSX (UI) based on the current 'step'.
   */
  const renderStep = () => {
    switch (step) {
      case 1: // STEP 1: Personal Details
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
            {/* Navigating to Step 2 */}
            <button onClick={() => setStep(2)} className="w-full primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
              Next: Farm Details <ArrowRight size={20} />
            </button>
          </div>
        );
      
      case 2: // STEP 2: Farm & Location
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

      case 3: // STEP 3: Automated Eligibility Check
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
                {/* Visual feedback of checks being performed */}
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

      case 4: // STEP 4: Identity Verification
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
                {signatureCaptured ? (
                  <div className="aspect-square bg-surface-container-low rounded-3xl border border-black/5 flex flex-col items-center justify-center relative overflow-hidden">
                     <p className="font-[satisfy] text-4xl text-neutral-800 -rotate-12">Mumba C.</p>
                     <button onClick={() => setSignatureCaptured(false)} className="absolute top-4 right-4 p-2 bg-neutral-200 text-neutral-600 rounded-full hover:bg-neutral-300">
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
              <button onClick={() => setStep(5)} className="flex-[2] bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2">
                Complete Registration <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        );

      case 5: // STEP 5: Success Message
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
        
        {/* STEP PROGRESS INDICATOR */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-1.5 rounded-full transition-all duration-500",
                // If current step is greater than or equal to 'i', color it primary.
                step >= i ? "bg-primary" : "bg-black/5"
              )}
            />
          ))}
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA: Based on current step */}
      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm max-w-3xl mx-auto">
        {renderStep()}
      </div>

      {/* CAMERA MODAL SIMULATION */}
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
              {/* Real Viewfinder with Simulation Fallback */}
              <div className="aspect-[3/4] bg-black rounded-[2rem] border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                {useSimulation ? (
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="feed" className="w-full h-full object-cover opacity-60" />
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

      {/* SIGNATURE MODAL SIMULATION */}
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
