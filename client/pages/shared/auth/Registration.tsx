// client/pages/shared/auth/Registration.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark, User, MapPin, Sprout, Lock, CheckCircle2,
  ArrowLeft, ArrowRight, Loader2, Eye, EyeOff, IdCard,
  QrCode, Copy, Camera, Upload, Pen, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as AppUser, UserRole } from '@/types';
import { useFarmers } from '@/context/FarmerContext';
import { toast } from 'sonner';

interface RegistrationProps {
  onLogin: (user: AppUser) => void;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const ZAMBIA_PROVINCES = [
  'Central', 'Copperbelt', 'Eastern', 'Luapula',
  'Lusaka', 'Muchinga', 'Northern', 'North-Western',
  'Southern', 'Western',
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  Lusaka:          ['Lusaka', 'Chilanga', 'Chongwe', 'Kafue', 'Luangwa', 'Rufunsa'],
  Southern:        ['Choma', 'Livingstone', 'Mazabuka', 'Monze', 'Kalomo', 'Namwala', 'Siavonga'],
  Northern:        ['Kasama', 'Mbala', 'Mpika', 'Nakonde', 'Mporokoso', 'Kaputa'],
  Eastern:         ['Chipata', 'Katete', 'Lundazi', 'Petauke', 'Nyimba', 'Mambwe', 'Sinda'],
  Copperbelt:      ['Kitwe', 'Ndola', 'Chingola', 'Mufulira', 'Luanshya', 'Kalulushi'],
  Central:         ['Kabwe', 'Kapiri Mposhi', 'Mkushi', 'Serenje', 'Chibombo'],
  Western:         ['Mongu', 'Senanga', 'Kaoma', 'Lukulu', 'Shangombo'],
  Luapula:         ['Mansa', 'Nchelenge', 'Kawambwa', 'Samfya', 'Mwense', 'Chienge'],
  Muchinga:        ['Chinsali', 'Isoka', 'Mpika', 'Shiwangandu', 'Kanchibiya'],
  'North-Western': ['Solwezi', 'Kasempa', 'Mwinilunga', 'Chavuma', 'Kabompo'],
};

const CROPS_LIST = [
  'White Maize', 'Yellow Maize', 'Soybeans', 'Groundnuts',
  'Sunflower', 'Wheat', 'Cotton', 'Cassava',
  'Sweet Potato', 'Sorghum', 'Millet', 'Rice',
  'Vegetables', 'Tobacco', 'Sugar Cane',
];

// ─── ID Generation ────────────────────────────────────────────────────────────

const generateFarmerID = (district: string): string => {
  const districtCode = district.slice(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const storageKey = `fra_seq_${districtCode}_${year}`;
  const lastSeq = parseInt(localStorage.getItem(storageKey) || '1000', 10);
  const nextSeq = lastSeq + 1;
  localStorage.setItem(storageKey, String(nextSeq));
  return `FRA/${districtCode}/${year}/${nextSeq}`;
};

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Personal',  icon: User   },
  { id: 2, label: 'Location',  icon: MapPin  },
  { id: 3, label: 'Farm',      icon: Sprout  },
  { id: 4, label: 'Security',  icon: Lock    },
  { id: 5, label: 'Signature', icon: Pen     },
  { id: 6, label: 'ID Card',   icon: IdCard  },
];

// ─── Signature Canvas ─────────────────────────────────────────────────────────

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  savedSignature: string;
}

/**
 * Canvas component used to capture the farmer's digital signature.
 *
 * Supports:
 * - Mouse drawing on desktop/laptop.
 * - Touch drawing on phones/tablets.
 * - Restoring a saved signature when the user returns to this step.
 * - Clearing the signature.
 */
const SignatureCanvas = ({ onSave, savedSignature }: SignatureCanvasProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const isDrawing  = useRef(false);
  const lastPos    = useRef<{ x: number; y: number } | null>(null);
  const hasStrokes = useRef(false);

  /**
   * Restore saved signature when the canvas mounts or when savedSignature changes.
   */
  useEffect(() => {
    if (savedSignature && canvasRef.current) {
      const img = new Image();

      img.onload = () => {
        canvasRef.current?.getContext('2d')?.drawImage(img, 0, 0);
      };

      img.src = savedSignature;
      hasStrokes.current = true;
    }
  }, [savedSignature]);

  /**
   * Converts a mouse/touch event into canvas coordinates.
   *
   * Important:
   * The canvas is displayed responsively, so the visual size may differ from
   * the real canvas width/height. scaleX and scaleY fix the coordinate mapping.
   */
  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];

      if (!touch) {
        return lastPos.current || { x: 0, y: 0 };
      }

      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top)  * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;
    lastPos.current   = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (!isDrawing.current || !canvasRef.current || !lastPos.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvasRef.current);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();

    lastPos.current    = pos;
    hasStrokes.current = true;
  };

  const stopDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (!isDrawing.current) return;

    isDrawing.current = false;
    lastPos.current   = null;

    if (canvasRef.current && hasStrokes.current) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokes.current = false;
    onSave('');
  };

  return (
    <div className="space-y-3">
      <div className="relative bg-white border-2 border-dashed border-neutral-300 rounded-2xl overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-40 cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          onTouchCancel={stopDraw}
        />

        <div className="absolute bottom-8 left-8 right-8 border-b border-neutral-200 pointer-events-none" />

        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-neutral-300 uppercase tracking-widest pointer-events-none whitespace-nowrap">
          Sign above the line
        </p>
      </div>

      <button
        type="button"
        onClick={clearCanvas}
        className="flex items-center gap-2 text-[10px] font-bold text-error/70 hover:text-error uppercase tracking-widest transition-colors"
      >
        <Trash2 size={12} /> Clear Signature
      </button>
    </div>
  );
};
// ─── Main Component ───────────────────────────────────────────────────────────

const Registration = ({ onLogin }: RegistrationProps) => {
  const navigate   = useNavigate();
  const { addFarmer } = useFarmers();

  // Two separate file inputs — one locks to camera, one opens gallery
  const cameraInputRef  = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep]                 = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPin, setShowPin]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [done, setDone]                 = useState(false);
  const [generatedID, setGeneratedID]   = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', nrc: '', gender: '', dob: '', phone: '',
    province: '', district: '', camp: '', gps: '',
    farmSize: '', landType: '', crops: [] as string[],
    pin: '', confirmPin: '',
    photo: '',     // base64
    signature: '', // base64
  });

  const set = (field: string, value: any) =>
  setForm((prev) => ({ ...prev, [field]: value }));

/**
 * Clears the generated Farmer ID when location changes.
 * This prevents a farmer from keeping an ID generated from a previous district.
 */
const resetGeneratedID = () => setGeneratedID('');

  const toggleCrop = (crop: string) =>
    set('crops', form.crops.includes(crop)
      ? form.crops.filter((c) => c !== crop)
      : [...form.crops, crop]);

/**
 * Generate Farmer ID only when the farmer reaches Step 6.
 *
 * We do not generate it earlier because:
 * - The district may still change.
 * - Farmer ID is district-based.
 * - The sequence number should only advance when the registration is ready.
 */
useEffect(() => {
  if (step === 6 && !generatedID && form.district) {
    setGeneratedID(generateFarmerID(form.district));
  }
}, [step, generatedID, form.district]);

/**
 * Handles photo upload from either:
 * - Camera input.
 * - Gallery/file input.
 *
 * The image is stored as a base64 data URL for local preview and persistence.
 */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be under 5MB.');

    /**
     * Reset input so the same file can be selected again after an error.
     */
    e.target.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = (ev) => {
    set('photo', ev.target?.result as string);
  };

  reader.readAsDataURL(file);

  /**
   * Reset input so the same file can be selected again if needed.
   */
  e.target.value = '';
};

  // ── Validation ─────────────────────────────────────────────────────────────
  /**
 * Validates the current registration step.
 *
 * Each step only validates its own fields so the user can move through
 * the form progressively.
 */
const validate = (): string | null => {
  if (step === 1) {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim())  return 'Last name is required.';
    if (!form.nrc.trim())       return 'NRC number is required.';
    if (!form.gender)           return 'Please select your gender.';
  }

  if (step === 2) {
    if (!form.province)    return 'Please select your province.';
    if (!form.district)    return 'Please select your district.';
    if (!form.camp.trim()) return 'Camp / constituency is required.';
  }

  if (step === 3) {
    if (!form.farmSize) return 'Please enter your farm size.';

    if (Number(form.farmSize) <= 0) {
      return 'Farm size must be greater than 0 hectares.';
    }

    if (form.crops.length === 0) return 'Select at least one crop.';
  }

  if (step === 4) {
    if (form.pin.length < 4)          return 'PIN must be at least 4 digits.';
    if (form.pin !== form.confirmPin) return 'PINs do not match.';
  }

  if (step === 5) {
    if (!form.signature) return 'Please provide your signature before continuing.';
  }

  return null;
};

  const handleNext = () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

/**
 * Completes farmer registration.
 *
 * On success:
 * 1. Creates the farmer payload.
 * 2. Saves the farmer using FarmerContext.
 * 3. Logs the farmer in immediately.
 * 4. Shows the success screen.
 * 5. Redirects to the farmer dashboard.
 */
const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    /**
     * Safety fallback:
     * The ID is normally generated when entering Step 6.
     * If it is still empty for any reason, generate it here before saving.
     */
    const farmerID = generatedID || generateFarmerID(form.district);

    if (!generatedID) {
      setGeneratedID(farmerID);
    }

    const farmer = {
      nrc:       form.nrc.trim(),
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      gender:    form.gender,
      district:  form.district,
      camp:      form.camp.trim(),
      farmSize:  form.farmSize,
      gps:       form.gps || undefined,
      crops:     form.crops,
      farmerID,
      photo:     form.photo     || undefined,
      signature: form.signature || undefined,

      /**
       * Store PIN so the farmer can later log in with NRC + PIN.
       */
      pin: form.pin,
    };

    await addFarmer(farmer as any);

    /**
     * Immediately authenticate the newly registered farmer.
     * Dashboard.tsx will show the farmer dashboard because role is FARMER.
     */
    onLogin({
      id:         farmerID,
      name:       `${farmer.firstName} ${farmer.lastName}`,
      first_name: farmer.firstName,
      role:       UserRole.FARMER,
      nrc:        farmer.nrc,
      district:   farmer.district,
      email:      `${farmer.firstName.toLowerCase()}@example.zm`,
      avatar:     farmer.photo || `https://picsum.photos/seed/${farmer.nrc}/200`,
      farmerID,
    });

    setDone(true);
    toast.success(`Welcome, ${farmer.firstName}! Registration successful.`);

    setTimeout(() => navigate('/dashboard'), 2500);
  } catch {
    toast.error('Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          {form.photo ? (
            <img
              src={form.photo}
              alt="Farmer"
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary shadow-2xl shadow-primary/30"
            />
          ) : (
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
              <CheckCircle2 size={48} className="text-white" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-black font-headline text-primary">
              Registration Complete!
            </h2>
            <p className="text-neutral-500 font-medium mt-1">
              Farmer ID: <span className="font-black text-primary">{generatedID}</span>
            </p>
            <p className="text-neutral-400 text-sm mt-1">Redirecting to your dashboard…</p>
          </div>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main Form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Landmark size={28} />
          </div>
          <h1 className="text-2xl font-black font-headline text-primary tracking-tight">
            Farmer Registration
          </h1>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Zambia Ministry of Agriculture • {new Date().getFullYear()}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-1">
          {STEPS.map((s, i) => {
            const Icon     = s.icon;
            const active   = step === s.id;
            const complete = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300',
                    complete ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : active ? 'bg-primary/10 text-primary ring-2 ring-primary'
                             : 'bg-surface-container-low text-neutral-400'
                  )}>
                    {complete ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={cn(
                    'text-[8px] font-black uppercase tracking-widest hidden sm:block',
                    active || complete ? 'text-primary' : 'text-neutral-400'
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-1 rounded-full transition-all duration-500',
                    step > s.id ? 'bg-primary' : 'bg-neutral-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22 }}
              className="p-8"
            >

              {/* ═══════════════════════════════════════════════════════════
                  STEP 1 — Personal Details + Photo Capture
              ═══════════════════════════════════════════════════════════ */}
              {step === 1 && (
                <div className="space-y-5">
                  <StepHeading
                    title="Personal Details"
                    sub="Your official information as it appears on your NRC."
                  />

                  {/* ── Photo Section ── */}
                  <div className="bg-surface-container-low rounded-[1.5rem] p-5 space-y-4 border border-black/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Profile Photo
                    </p>

                    {/* Preview */}
                    <div className="flex justify-center">
                      {form.photo ? (
                        <div className="relative">
                          <img
                            src={form.photo}
                            alt="Profile preview"
                            className="w-28 h-28 rounded-[1.5rem] object-cover border-4 border-white shadow-xl"
                          />
                          <button
                            type="button"
                            onClick={() => set('photo', '')}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-error text-white rounded-full flex items-center justify-center shadow-md hover:bg-error/80 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-[1.5rem] bg-white border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-300 gap-2">
                          <User size={35} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">
                            No Photo
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── TWO HIDDEN INPUTS ──
                        cameraInputRef  → capture="user"  → opens front camera on mobile
                        galleryInputRef → no capture attr  → opens file picker / gallery
                    */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />

                    {/* ── TWO VISIBLE BUTTONS ── */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Button 1: Take Photo — triggers cameraInputRef */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 active:scale-95 transition-all border border-primary/10"
                      >
                        <Camera size={24} />
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-wide">
                            Take Photo
                          </p>
                          <p className="text-[8px] font-medium opacity-60 mt-0.5">
                            Opens device camera
                          </p>
                        </div>
                      </button>

                      {/* Button 2: Upload — triggers galleryInputRef */}
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 bg-white text-neutral-600 rounded-2xl hover:bg-neutral-50 active:scale-95 transition-all border border-black/5 shadow-sm"
                      >
                        <Upload size={24} />
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-wide">
                            Upload Photo
                          </p>
                          <p className="text-[8px] font-medium opacity-60 mt-0.5">
                            From gallery or files
                          </p>
                        </div>
                      </button>
                    </div>

                    <p className="text-[9px] text-neutral-400 font-medium text-center">
                      Optional — passport-style photo recommended
                    </p>
                  </div>

                  {/* ── Personal Fields ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" required>
                      <input value={form.firstName}
                        onChange={(e) => set('firstName', e.target.value)}
                        placeholder="e.g. Henry" className={inputCls} />
                    </Field>
                    <Field label="Last Name" required>
                      <input value={form.lastName}
                        onChange={(e) => set('lastName', e.target.value)}
                        placeholder="e.g. Mate" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="NRC Number" required hint="Format: 000000/00/1">
                    <input value={form.nrc}
                      onChange={(e) => set('nrc', e.target.value)}
                      placeholder="852016/10/1" className={inputCls} />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Gender" required>
                      <select value={form.gender}
                        onChange={(e) => set('gender', e.target.value)}
                        className={inputCls}>
                        <option value="">Select…</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </Field>
                    <Field label="Date of Birth">
                      <input type="date" value={form.dob}
                        onChange={(e) => set('dob', e.target.value)}
                        className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Phone Number">
                    <input value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="097 000 0000" className={inputCls} />
                  </Field>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  STEP 2 — Location Details
              ═══════════════════════════════════════════════════════════ */}
              {step === 2 && (
                <div className="space-y-5">
                  <StepHeading title="Location Details" sub="Where is your farm located?" />

                  <Field label="Province" required>
                    <select
                          value={form.province}
                          onChange={(e) => {
                            set('province', e.target.value);
                            set('district', '');
                            resetGeneratedID();
                          }}
                          className={inputCls}
                        >
                      <option value="">Select Province…</option>
                      {ZAMBIA_PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>

                  <Field label="District" required>
                        <select
                              value={form.district}
                              onChange={(e) => {
                                set('district', e.target.value);
                                resetGeneratedID();
                              }}
                              disabled={!form.province}
                              className={cn(inputCls, !form.province && 'opacity-50 cursor-not-allowed')}
                            >
                      <option value="">Select District…</option>
                      {(DISTRICTS_BY_PROVINCE[form.province] || []).map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Camp / Constituency / Block" required>
                    <input value={form.camp}
                      onChange={(e) => set('camp', e.target.value)}
                      placeholder="e.g. Central Camp" className={inputCls} />
                  </Field>

                  <Field label="GPS Coordinates" hint="Optional — tap icon to detect">
                    <div className="flex gap-2">
                      <input value={form.gps}
                        onChange={(e) => set('gps', e.target.value)}
                        placeholder="-13.1234, 28.4567"
                        className={cn(inputCls, 'flex-1')} />
                      <button type="button"
                        onClick={() => {
                          if (!navigator.geolocation) { toast.error('GPS not available.'); return; }
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              set('gps', `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                              toast.success('GPS location captured!');
                            },
                            () => toast.error('Could not access GPS.')
                          );
                        }}
                        className="px-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors">
                        <MapPin size={16} />
                      </button>
                    </div>
                  </Field>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  STEP 3 — Farm Details
              ═══════════════════════════════════════════════════════════ */}
              {step === 3 && (
                <div className="space-y-5">
                  <StepHeading title="Farm Details" sub="Tell us about your farming operation." />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Farm Size (Ha)" required>
                      <input type="number" step="0.1" min="0.1" value={form.farmSize}
                        onChange={(e) => set('farmSize', e.target.value)}
                        placeholder="e.g. 2.5" className={inputCls} />
                    </Field>
                    <Field label="Land Ownership">
                      <select value={form.landType}
                        onChange={(e) => set('landType', e.target.value)}
                        className={inputCls}>
                        <option value="">Select…</option>
                        <option>Owned</option>
                        <option>Leased</option>
                        <option>Communal</option>
                        <option>State Land</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Crops Grown" required hint="Select all that apply">
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {CROPS_LIST.map((crop) => {
                        const selected = form.crops.includes(crop);
                        return (
                          <button key={crop} type="button" onClick={() => toggleCrop(crop)}
                            className={cn(
                              'px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all border text-left leading-tight',
                              selected
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                : 'bg-surface-container-low text-neutral-500 border-black/5 hover:border-primary/30'
                            )}>
                            {crop}
                          </button>
                        );
                      })}
                    </div>
                    {form.crops.length > 0 && (
                      <p className="text-[10px] font-bold text-primary mt-2">
                        ✓ {form.crops.length} crop{form.crops.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </Field>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  STEP 4 — Security PIN
              ═══════════════════════════════════════════════════════════ */}
              {step === 4 && (
                <div className="space-y-5">
                  <StepHeading title="Set Your PIN" sub="You'll use this PIN to log in with your NRC number." />

                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                      Registration Summary
                    </p>
                    <SummaryRow label="Name"     value={`${form.firstName} ${form.lastName}`} />
                    <SummaryRow label="NRC"      value={form.nrc} />
                    <SummaryRow label="District" value={`${form.district}, ${form.province}`} />
                    <SummaryRow label="Farm"     value={`${form.farmSize} Ha — ${form.crops.slice(0, 2).join(', ')}${form.crops.length > 2 ? ` +${form.crops.length - 2}` : ''}`} />
                  </div>

                  <Field label="Create PIN" required hint="4–6 digits">
                    <div className="relative">
                      <input type={showPin ? 'text' : 'password'}
                        value={form.pin}
                        onChange={(e) => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        className={cn(inputCls, 'tracking-[0.5em] text-center pr-12')} />
                      <button type="button" onClick={() => setShowPin((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Confirm PIN" required>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPin}
                        onChange={(e) => set('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        className={cn(inputCls, 'tracking-[0.5em] text-center pr-12')} />
                      <button type="button" onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.pin && form.confirmPin && form.pin !== form.confirmPin && (
                      <p className="text-[10px] text-error font-bold mt-1">PINs do not match</p>
                    )}
                  </Field>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  STEP 5 — Digital Signature
              ═══════════════════════════════════════════════════════════ */}
              {step === 5 && (
                <div className="space-y-5">
                  <StepHeading
                    title="Digital Signature"
                    sub="Draw your signature using your finger or mouse."
                  />

                  <SignatureCanvas
                    onSave={(dataUrl) => set('signature', dataUrl)}
                    savedSignature={form.signature}
                  />

                  {form.signature && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/5 border border-primary/10 rounded-2xl p-4"
                    >
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">
                        Signature Preview
                      </p>
                      <img src={form.signature} alt="Signature" className="max-h-16 object-contain" />
                    </motion.div>
                  )}

                  <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
                    <p className="text-[10px] font-bold text-neutral-500 leading-relaxed">
                      By signing, you confirm all information is accurate and consent to its use
                      for agricultural support services under the Zambia Ministry of Agriculture.
                    </p>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  STEP 6 — Generated ID Card
              ═══════════════════════════════════════════════════════════ */}
              {step === 6 && (
                <div className="space-y-6">
                  <StepHeading
                    title="Your Farmer ID"
                    sub="Your unique registration ID has been generated. Keep this safe."
                  />

                  {/* Digital ID Card */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="primary-gradient rounded-[2rem] p-6 text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Landmark size={14} className="opacity-70" />
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
                              Republic of Zambia
                            </p>
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                            Ministry of Agriculture
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Farmer Registration Card
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <QrCode size={20} />
                        </div>
                      </div>

                      {/* Photo + Name */}
                      <div className="flex items-center gap-4 mb-4">
                        {form.photo ? (
                          <img
                            src={form.photo}
                            alt="Farmer"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white/30 shadow-lg shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <User size={28} className="opacity-60" />
                          </div>
                        )}
                        <div>
                          <p className="text-[9px] font-bold uppercase opacity-60 mb-0.5">Full Name</p>
                          <p className="text-lg font-black font-headline leading-tight">
                            {form.firstName} {form.lastName}
                          </p>
                          <p className="text-[9px] opacity-60 font-bold uppercase">{form.gender}</p>
                        </div>
                      </div>

                      {/* Farmer ID — prominent */}
                      <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 mb-4 border border-white/10">
                        <p className="text-[9px] font-bold uppercase opacity-60 mb-0.5">Farmer ID</p>
                        <p className="text-xl font-black font-mono tracking-widest">{generatedID}</p>
                      </div>

                      {/* Footer grid */}
                      <div className="grid grid-cols-3 gap-3 text-[10px] mb-4">
                        <div>
                          <p className="opacity-60 font-bold uppercase mb-0.5">NRC</p>
                          <p className="font-black text-[9px]">{form.nrc}</p>
                        </div>
                        <div>
                          <p className="opacity-60 font-bold uppercase mb-0.5">District</p>
                          <p className="font-black">{form.district}</p>
                        </div>
                        <div>
                          <p className="opacity-60 font-bold uppercase mb-0.5">Farm</p>
                          <p className="font-black">{form.farmSize} Ha</p>
                        </div>
                      </div>

                      {/* Signature strip */}
                      {form.signature && (
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-[8px] font-bold uppercase opacity-50 mb-1">
                            Farmer Signature
                          </p>
                          <img
                            src={form.signature}
                            alt="Signature"
                            className="h-8 object-contain brightness-0 invert opacity-80"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedID);
                      toast.success('Farmer ID copied to clipboard!');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-low rounded-2xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors border border-black/5"
                  >
                    <Copy size={14} /> Copy ID: {generatedID}
                  </button>

                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-primary/80 leading-relaxed">
                      <span className="font-black text-primary">Important:</span> Use your{' '}
                      <span className="font-black">NRC number</span> to log in at any time.
                      Your Farmer ID is your unique government reference number.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="px-8 pb-8 flex gap-3">
            <button
              onClick={step > 1 ? handleBack : () => navigate('/login')}
              className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            {step < 6 ? (
              <button
                onClick={handleNext}
                className="flex-1 primary-gradient text-white py-4 rounded-2xl font-black font-headline text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 primary-gradient text-white py-4 rounded-2xl font-black font-headline text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? <><Loader2 size={20} className="animate-spin" /> Registering…</>
                  : <><CheckCircle2 size={20} /> Complete Registration</>
                }
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-neutral-400 mt-6 uppercase tracking-[0.2em]">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="text-primary underline underline-offset-2">
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all';

const StepHeading = ({ title, sub }: { title: string; sub: string }) => (
  <div>
    <h2 className="text-xl font-black font-headline">{title}</h2>
    <p className="text-xs text-neutral-400 font-medium mt-0.5">{sub}</p>
  </div>
);

const Field = ({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center ml-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {hint && <span className="text-[9px] font-medium text-neutral-400">{hint}</span>}
    </div>
    {children}
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-bold text-neutral-400 uppercase">{label}</span>
    <span className="text-xs font-bold text-neutral-900">{value}</span>
  </div>
);

export default Registration;