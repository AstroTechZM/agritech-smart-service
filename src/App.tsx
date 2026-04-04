import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Ticket,
  Package,
  Truck,
  Shield,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronRight,
  Plus,
  Home,
  QrCode,
  User as UserIcon,
  Wallet,
  TrendingUp,
  Map as MapIcon,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Smartphone,
  Landmark,
  MoreVertical,
  Scale,
  Receipt,
  History,
  Navigation,
  Eye,
  EyeOff,
  Database,
  Pencil,
  MapPin,
  ShieldCheck,
  Camera,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole, User } from '@/src/types';

// --- Mock Data ---
const MOCK_USERS: Record<UserRole, User> = {
  FARMER: { id: '1', name: 'Mumba Chileshe', role: 'FARMER', avatar: 'https://picsum.photos/seed/farmer/200', nrc: '102934/11/1' },
  AGRO_DEALER: { id: '2', name: 'Chanda Mwila', role: 'AGRO_DEALER', avatar: 'https://picsum.photos/seed/dealer/200', email: 'chanda@agrigrow.zm' },
  AGENT: { id: '3', name: 'John Doe', role: 'AGENT', avatar: 'https://picsum.photos/seed/clerk/200', nrc: '482910/11/1' },
  ADMIN: { id: '4', name: 'Mubita Mwanawasa', role: 'ADMIN', avatar: 'https://picsum.photos/seed/admin1/200', email: 'admin@agriculture.gov.zm' },
};

// --- Components ---

const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [role, setRole] = useState<UserRole>('FARMER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Landmark size={32} />
          </div>
          <h1 className="text-2xl font-black font-headline text-primary tracking-tight">Agri Tech Portal</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Government of Zambia</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-2xl">
            {(['FARMER', 'AGRO_DEALER', 'AGENT', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  role === r ? "bg-primary text-white shadow-md" : "text-neutral-500 hover:bg-black/5"
                )}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">NRC or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'FARMER' || role === 'AGENT' ? "000000/00/1" : "email@example.zm"}
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm tracking-[0.5em] text-center focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            onClick={() => onLogin(role)}
            className="w-full primary-gradient text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Login to Portal
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-400 bg-surface-container-lowest px-2">New to Agri-Tech?</div>
          </div>

          <button className="w-full bg-tertiary text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Register My Farm
          </button>
        </div>
      </motion.div>
      <p className="mt-8 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Secure Access • 2026 Season</p>
    </div>
  );
};

const Sidebar = ({ role, activeTab, setActiveTab, isOpen, onClose, onLogout }: {
  role: UserRole,
  activeTab: string,
  setActiveTab: (t: string) => void,
  isOpen: boolean,
  onClose: () => void,
  onLogout: () => void
}) => {
  const allMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket },
    { id: 'deliveries', label: 'Deliveries', icon: History },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'registration', label: 'Registration', icon: Users },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const MENU_PERMISSIONS: Record<UserRole, string[]> = {
    FARMER: ['overview', 'vouchers', 'deliveries'],
    AGRO_DEALER: ['overview', 'vouchers', 'stock'],
    AGENT: ['overview', 'stock', 'logistics', 'registration'],
    ADMIN: ['overview', 'vouchers', 'stock', 'registration', 'logistics', 'payments', 'security'],
  };

  const menuItems = allMenuItems.filter(item => MENU_PERMISSIONS[role].includes(item.id));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "flex flex-col w-72 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-black/5 z-[70] transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Package size={24} />
            </div>
            <div>
              <p className="text-lg font-black text-primary font-headline leading-tight">AgriTech</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Smart Service</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-neutral-500 hover:bg-black/5 rounded-full">
            <EyeOff size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-bold text-sm transition-all relative group",
                activeTab === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-neutral-600 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-neutral-400 group-hover:text-primary"
              )} />
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-black/5 space-y-4">
          <div className="bg-surface-container-high/50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium">Network Online</span>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 text-neutral-500 px-4 py-2.5 text-sm font-bold hover:text-primary transition-colors rounded-xl hover:bg-primary/5">
              <UserIcon size={18} />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-500 px-4 py-2.5 text-sm font-bold hover:text-primary transition-colors rounded-xl hover:bg-primary/5">
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 text-neutral-500 px-4 py-2.5 text-sm font-bold hover:text-error transition-colors rounded-xl hover:bg-error/5"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const TopBar = ({ user, onRoleChange, onMenuToggle, activeTab }: {
  user: User,
  onRoleChange: (r: UserRole) => void,
  onMenuToggle: () => void,
  activeTab: string
}) => {
  return (
    <header className="fixed top-0 right-0 left-0 h-20 glass-panel border-b border-black/5 z-50 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex lg:hidden items-center justify-center text-white">
            <Package size={18} />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
            <h1 className="text-lg lg:text-xl font-black text-primary font-headline tracking-tighter leading-none">
              Agri<span className="text-neutral-900">Tech</span>
            </h1>
            <div className="hidden lg:block w-px h-4 bg-black/10 mx-1" />
            <span className="text-[10px] lg:text-xs font-bold text-neutral-400 uppercase tracking-widest lg:mt-0.5">
              {activeTab}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-6">
        <div className="hidden md:flex items-center bg-surface-container-low rounded-2xl px-4 py-2 border border-black/5">
          <Search size={18} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 lg:w-64"
          />
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button className="p-2.5 text-neutral-500 hover:bg-black/5 rounded-2xl relative transition-all hover:scale-110">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>

          <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-black/5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-neutral-900 leading-none">{user.name}</p>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="relative">
              <img src={user.avatar} alt="Avatar" className="w-9 h-9 lg:w-11 lg:h-11 rounded-2xl border-2 border-primary/10 object-cover shadow-md" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={10} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const MobileNav = ({ role, activeTab, setActiveTab, onMenuToggle }: { role: UserRole, activeTab: string, setActiveTab: (t: string) => void, onMenuToggle: () => void }) => {
  const navConfig: Record<UserRole, any[]> = {
    FARMER: [
      { id: 'overview', icon: Home, label: 'Home' },
      { id: 'deliveries', icon: History, label: 'Deliveries', primary: true },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    AGRO_DEALER: [
      { id: 'overview', icon: Home, label: 'Home' },
      { id: 'scan', icon: QrCode, label: 'Scan', primary: true },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    AGENT: [
      { id: 'overview', icon: Home, label: 'Home' },
      { id: 'registration', icon: Users, label: 'Register', primary: true },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    ADMIN: [
      { id: 'overview', icon: Home, label: 'Home' },
      { id: 'security', icon: Shield, label: 'Security', primary: true },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
  };

  const items = navConfig[role] || navConfig.FARMER;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-black/5 z-50 grid justify-items-center items-center px-4 pb-2 grid-cols-3">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.label}
            onClick={() => item.id === 'menu' ? onMenuToggle() : setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              item.primary
                ? "bg-primary text-white p-4 rounded-2xl -translate-y-6 shadow-xl shadow-primary/20 scale-110"
                : isActive ? "text-primary" : "text-neutral-400 hover:text-primary/70"
            )}
          >
            <item.icon size={item.primary ? 24 : 20} className={cn(!item.primary && isActive && "scale-110 transition-transform")} />
            {!item.primary && <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
};

// --- Role Specific Screens ---

export const MOCK_DELIVERIES = [
  { id: 'DEL-1042', date: '02 Apr 2026', produceType: 'White Maize', weight: '2,500 kg', grade: 'A', moisture: '12.5%', amount: 'ZMW 12,500', paymentStatus: 'PROCESSING', depot: 'Sinda Central Depot' },
  { id: 'DEL-0988', date: '15 Mar 2026', produceType: 'Soybeans', weight: '850 kg', grade: 'B', moisture: '11.0%', amount: 'ZMW 6,800', paymentStatus: 'PAID', depot: 'Kasama District Depot' },
  { id: 'DEL-0821', date: '10 May 2025', produceType: 'White Maize', weight: '3,200 kg', grade: 'A', moisture: '12.8%', amount: 'ZMW 16,000', paymentStatus: 'PAID', depot: 'Kasama District Depot' },
  { id: 'DEL-0750', date: '28 Apr 2025', produceType: 'Groundnuts', weight: '400 kg', grade: 'A', moisture: '8.2%', amount: 'ZMW 4,000', paymentStatus: 'PAID', depot: 'Mongu Hub' },
];

const DeliveriesPanel = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const deliveries = MOCK_DELIVERIES;

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
              Harvest Records
            </span>
            <h2 className="text-3xl font-black font-headline tracking-tight">Deliveries History</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((del) => (
            <div
              key={del.id}
              onClick={() => setSelectedDelivery(del)}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{del.produceType}</p>
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-0.5">{del.date}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2 flex items-center gap-1"><MapIcon size={10} /> {del.depot}</div>
                <p className="text-xs font-black font-mono text-primary">{del.amount}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  del.paymentStatus === 'PAID' ? "bg-tertiary/10 text-tertiary" :
                    del.paymentStatus === 'PROCESSING' ? "bg-primary/10 text-primary animate-pulse" :
                      "bg-error/10 text-error"
                )}>
                  {del.paymentStatus}
                </span>
                <span className="text-[10px] text-neutral-400 font-bold bg-black/5 px-2 py-1 rounded-lg">Details <ChevronRight size={12} className="inline -mt-0.5" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedDelivery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDelivery(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDelivery(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-neutral-500 transition-colors"
              >
                <span className="text-lg font-black leading-none mb-0.5">✕</span>
              </button>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
                Delivery Receipt
              </span>
              <h3 className="text-2xl font-black font-headline mb-6">{selectedDelivery.id}</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Date</span>
                  <span className="text-sm font-bold">{selectedDelivery.date}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Delivery Depot</span>
                  <span className="text-sm font-bold text-right text-primary">{selectedDelivery.depot}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Produce Type</span>
                  <span className="text-sm font-bold">{selectedDelivery.produceType}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Weight</span>
                  <span className="text-sm font-bold">{selectedDelivery.weight}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/5">
                  <span className="text-xs uppercase font-bold text-neutral-400">Quality Details</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-xs font-black text-primary">Grade {selectedDelivery.grade}</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Moist: {selectedDelivery.moisture}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 bg-primary/5 p-4 rounded-2xl flex justify-between items-center border border-primary/10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Total Payout</p>
                    <p className="font-black font-mono text-xl tracking-tight text-primary">{selectedDelivery.amount}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest block",
                      selectedDelivery.paymentStatus === 'PAID' ? "bg-tertiary border border-tertiary/20 text-white shadow-lg shadow-tertiary/20" :
                        selectedDelivery.paymentStatus === 'PROCESSING' ? "bg-white text-primary border border-primary/20 shadow-lg animate-pulse" :
                          "bg-error/10 text-error"
                    )}>
                      {selectedDelivery.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Role Specific Screens ---

const VouchersPanel = ({ role }: { role: UserRole }) => {
  const isFarmer = role === 'FARMER';
  const isDealer = role === 'AGRO_DEALER';
  const isAdmin = role === 'ADMIN';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {isAdmin ? 'System Oversight' : 'Voucher Management'}
          </span>
          <h2 className="text-3xl font-black font-headline tracking-tight">
            {isAdmin ? 'Voucher Analytics' : 'FISP Eligibility & Vouchers'}
          </h2>
        </div>
        {isFarmer && (
          <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest rounded-full border border-primary/20">
            ELIGIBLE FOR 2026
          </span>
        )}
      </div>

      {isFarmer && (
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Eligibility Check Result</h3>
              <p className="text-sm text-neutral-500">Your profile has been verified for the current farming season.</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-3xl border border-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-500">Active Voucher</p>
                  <h4 className="text-2xl font-black font-headline">D-Compound Fertilizer</h4>
                </div>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">Valid</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">PIN Code</p>
                  <p className="text-lg font-mono font-black tracking-widest">••••••</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Input Type</p>
                  <p className="text-sm font-bold">Fertilizer</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Amount</p>
                  <p className="text-sm font-bold">8 Bags (400kg)</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Expiry Date</p>
                  <p className="text-sm font-bold">30 Nov 2026</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                  <QrCode size={20} /> Show Redemption QR
                </button>
                <button className="flex-1 bg-white border border-black/10 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-all">
                  <MapIcon size={20} /> Find Nearest Agro-Dealer
                </button>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-headline px-1">Voucher History</h3>
        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Voucher ID</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Input</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { id: 'V-9921', type: 'D-Compound Fertilizer', date: '12 Oct 2025', status: 'ACTIVE' },
                { id: 'V-8810', type: 'Maize Seed (10kg)', date: '05 Sep 2025', status: 'REDEEMED' },
                { id: 'V-7705', type: 'Urea Fertilizer', date: '20 Oct 2024', status: 'EXPIRED' },
              ].map((v) => (
                <tr key={v.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-sm">{v.id}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500 font-medium">{v.type}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500 font-medium">{v.date}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      v.status === 'ACTIVE' ? "bg-primary/10 text-primary" :
                        v.status === 'REDEEMED' ? "bg-tertiary/10 text-tertiary" : "bg-neutral-100 text-neutral-400"
                    )}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StockPanel = ({ role }: { role: UserRole }) => {
  const isDealer = role === 'AGRO_DEALER';
  const isClerk = role === 'AGENT';
  const isAdmin = role.includes('ADMIN');

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
          {/* <h2 className="text-3xl font-black font-headline tracking-tight">Stock Management</h2> */}
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
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Action</th>
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

const LogisticsPanel = ({ role }: { role: UserRole }) => {
  const isFarmer = role === 'FARMER';
  const isClerk = role === 'AGENT';
  const isAdmin = role.includes('ADMIN');

  // NOTE: Logic will later be implemented by the backend
  const assignedDepot = 'Kasama Hub'; // Simulated agent assignment

  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const shipments = [
    { id: 'TRK-202', from: 'Central Depot', to: 'Kasama Hub', status: 'IN TRANSIT', eta: '2h 15m', cargo: '400 Bags Urea', agent: 'James Phiri', bags: 400, dispatched: '08:30 AM', vehicle: 'Scania R450 (ABZ 1234)' },
    { id: 'TRK-105', from: 'Lusaka Plant', to: 'Choma Depot', status: 'LOADING', eta: 'Tomorrow', cargo: 'Maize Seeds', agent: 'Sarah Banda', bags: 1200, dispatched: 'Pending', vehicle: 'Volvo FH16 (BCA 9876)' },
    { id: 'TRK-309', from: 'Southern Hub', to: 'Farmer Group A', status: 'DELIVERED', eta: 'Completed', cargo: 'D-Compound', agent: 'Michael Zulu', bags: 250, dispatched: 'Yesterday, 14:00', vehicle: 'Isuzu FTR (XYZ 4567)' },
  ];

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Supply Chain</span>
            <h2 className="text-3xl font-black font-headline tracking-tight">
              {isFarmer ? 'My Deliverables' : 'Logistics & Fleet'}
            </h2>
          </div>
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/10 transition-colors text-primary">
            <Navigation size={16} /> Live Tracking
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {shipments.map((shipment) => (
              <div 
                key={shipment.id} 
                onClick={() => setSelectedShipment(shipment)}
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md group"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Truck size={32} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{shipment.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold",
                      shipment.status === 'IN TRANSIT' ? "bg-tertiary/10 text-tertiary" :
                        shipment.status === 'DELIVERED' ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-400"
                    )}>
                      {shipment.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{shipment.from} <ArrowRight size={14} className="inline mx-1 text-neutral-300 group-hover:text-primary transition-colors" /> {shipment.to}</h4>
                  <p className="text-xs text-neutral-500">{shipment.cargo}</p>
                </div>
                <div className="flex flex-col items-end justify-center gap-2 text-right">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-neutral-400">ETA / Status</p>
                    <p className="text-lg font-black font-headline text-primary">{shipment.eta}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold bg-black/5 px-2 py-1 rounded-lg">Details <ChevronRight size={12} className="inline -mt-0.5" /></span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-black/5">
              <h4 className="text-lg font-bold font-headline mb-4 text-primary">Live Fleet Tracking</h4>
              <p className="text-sm text-neutral-500 mb-8">Enter a vehicle registration or shipment ID to view real-time GPS location.</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-4">Search Identifier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ABZ 1234 or TRK-202" 
                    className="w-full bg-white px-5 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-neutral-300 shadow-sm"
                  />
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                  <Navigation size={18} className="group-hover:rotate-45 transition-transform duration-300" /> Locate Vehicle
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-bold">3 Trucks Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-tertiary rounded-full" />
                  <span className="text-xs font-bold">1 Delay Reported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedShipment && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedShipment(null)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-container-lowest rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-black/5"
            >
              <div className="bg-surface-container-low p-6 py-8 border-b border-black/5 text-center relative">
                <button 
                  onClick={() => setSelectedShipment(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-neutral-500 transition-colors"
                >
                  <span className="text-lg font-black leading-none mb-0.5">✕</span>
                </button>
                
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                  Transit Manifest
                </span>
                <h3 className="text-3xl font-black font-headline tracking-tight">{selectedShipment.id}</h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 p-4 rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Source</p>
                    <p className="font-bold text-sm">{selectedShipment.from}</p>
                    <p className="text-[10px] text-neutral-500 font-bold mt-1 flex items-center gap-1"><UserIcon size={10}/> Agnt: {selectedShipment.agent}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Destination</p>
                    <p className="font-bold text-sm text-primary">{selectedShipment.to}</p>
                    <p className="text-[10px] text-primary/70 font-bold mt-1 flex items-center gap-1"><MapIcon size={10}/> {selectedShipment.eta}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Cargo Details</span>
                    <div className="text-right">
                      <p className="text-sm font-bold">{selectedShipment.cargo}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{selectedShipment.bags} Bags Count</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Transport Vehicle</span>
                    <span className="text-sm font-bold flex items-center gap-2"><Truck size={14} className="text-primary"/> {selectedShipment.vehicle}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Dispatch Time</span>
                    <span className="text-sm font-bold">{selectedShipment.dispatched}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 pb-2 border-b border-black/5">
                  <span className="text-[11px] font-bold uppercase text-neutral-500">Current Status</span>
                  <span className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                    selectedShipment.status === 'IN TRANSIT' ? "bg-tertiary text-white border-tertiary/20 shadow-tertiary/20" : 
                    selectedShipment.status === 'LOADING' ? "bg-white text-primary border-primary/20 animate-pulse shadow-primary/10" : 
                    "bg-primary text-white border-primary/20 shadow-primary/20"
                  )}>
                    {selectedShipment.status}
                  </span>
                </div>

                {isClerk && selectedShipment.status === 'IN TRANSIT' && selectedShipment.to === assignedDepot && (
                  <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-center">Destination Actions</p>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-error/10 hover:bg-error/20 text-error px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle size={16} /> Flag Problem
                      </button>
                      <button className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> Confirm Arrival
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const RegistrationPanel = () => {
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


const SecurityPanel = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error mb-1 block">Integrity Monitoring</span>
        <h2 className="text-3xl font-black font-headline tracking-tight text-neutral-900">Security & Fraud</h2>
      </div>
      <button className="bg-error text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-error/20">
        <Shield size={16} /> Run Audit
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-error-container/10 p-8 rounded-[2.5rem] border border-error/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-error text-white rounded-2xl shadow-lg shadow-error/20">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold font-headline">Active Alerts</h4>
            <p className="text-xs text-error/80">Requiring immediate action</p>
          </div>
        </div>
        <p className="text-6xl font-black font-headline text-error">12</p>
        <div className="mt-6 pt-6 border-t border-error/10 space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>High Priority</span>
            <span className="text-error">04</span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span>Medium Priority</span>
            <span>08</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
        <h4 className="text-lg font-bold font-headline mb-6">Recent Anomalies</h4>
        <div className="space-y-4">
          {[
            { msg: 'Multiple redemption attempts from same IP', loc: 'Kitwe', time: '10m ago', severity: 'HIGH' },
            { msg: 'NRC validation failure threshold exceeded', loc: 'Lusaka', time: '45m ago', severity: 'MED' },
            { msg: 'GPS mismatch on mobile redemption', loc: 'Choma', time: '2h ago', severity: 'LOW' },
          ].map((alert, i) => (
            <div key={i} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between group hover:bg-error/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  alert.severity === 'HIGH' ? "bg-error" : alert.severity === 'MED' ? "bg-tertiary" : "bg-primary"
                )} />
                <div>
                  <p className="text-sm font-bold">{alert.msg}</p>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">{alert.loc} • {alert.time}</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-primary uppercase border-b border-primary opacity-0 group-hover:opacity-100 transition-opacity">Investigate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FarmerDashboard = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Zambia Ministry of Agriculture</span>
        <h2 className="text-3xl font-black font-headline tracking-tight">Mumba Chileshe</h2>
        <p className="text-sm text-neutral-500">NRC: 102934/11/1</p>
      </div>
      <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest rounded-full border border-primary/20">
        FISP ELIGIBLE
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 primary-gradient p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Farmer Wallet Balance</span>
            <Wallet size={24} className="opacity-80" />
          </div>
          <h3 className="text-5xl font-black font-headline">ZMW 4,850.00</h3>
          <button className="w-full bg-white/20 backdrop-blur-md border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
            Withdrawal to Airtel Money <ArrowRight size={18} />
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-tertiary-fixed-dim/20 rounded-2xl text-tertiary">
            <TrendingUp size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase text-neutral-500">FRA Buying Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black font-headline">ZMW 280.00</p>
              <span className="text-[10px] text-primary font-bold">▲ 5%</span>
            </div>
            <p className="text-[10px] text-neutral-400">per 50kg bag (White Maize)</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-headline flex items-center gap-2">
            <Ticket size={20} className="text-primary" />
            Active Voucher Status
          </h3>
          <button onClick={() => setActiveTab('vouchers')} className="text-xs font-bold text-primary">Details</button>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-bold text-lg">Maize Input D-Compound</p>
              <p className="text-xs text-neutral-400">Voucher ID: #FRA-9921</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded uppercase">Active</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-500">Allocation</p>
              <p className="text-2xl font-black text-primary">8 Bags</p>
            </div>
            <p className="text-xs font-bold text-neutral-400 italic">Expires: 30 Nov 2026</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-headline">Last Delivery Record</h3>
          <button onClick={() => setActiveTab('deliveries')} className="text-xs font-bold text-primary">History</button>
        </div>
        <div 
          onClick={() => setActiveTab('deliveries')}
          className="bg-surface-container-low p-4 rounded-2xl flex gap-4 items-center cursor-pointer hover:bg-surface-container-lowest transition-all hover:shadow-sm group"
        >
          <div className="w-16 h-16 bg-surface-container-high rounded-xl overflow-hidden flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Package size={32} />
          </div>
          <div className="flex-1">
            <p className="font-bold">{MOCK_DELIVERIES[0].depot}</p>
            <p className="text-xs text-neutral-500">{MOCK_DELIVERIES[0].produceType} • {MOCK_DELIVERIES[0].weight}</p>
            <div className="flex items-center gap-1 mt-1 text-primary">
              <CheckCircle2 size={12} />
              <span className="text-[10px] font-bold uppercase">Delivered: {MOCK_DELIVERIES[0].date}</span>
            </div>
          </div>
          <div className="text-neutral-400 group-hover:text-primary transition-colors">
            <ChevronRight size={20} />
          </div>
        </div>
      </section>
    </div>

    {/* Mobile Bottom Nav is handled in App.tsx but we can show labels here for clarity if needed */}
  </div>
);

const VoucherRedemptionScreen = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [voucherCode, setVoucherCode] = useState('');

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <QrCode size={40} />
              </div>
              <h3 className="text-2xl font-black font-headline">Scan Voucher</h3>
              <p className="text-sm text-neutral-500">Enter the 12-digit voucher code or scan the QR code from the farmer's app.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Voucher Code</label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="e.g. FISP-2026-XXXX"
                  className="w-full bg-surface-container-low border border-black/5 rounded-2xl px-6 py-4 font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!voucherCode}
                className="w-full primary-gradient text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
              >
                Validate Voucher <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black font-headline">Agri-Tech Auth</h3>
              <p className="text-sm text-neutral-500">A verification code has been sent to the farmer's registered mobile number (••••••772).</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Enter OTP</label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-16 bg-surface-container-low border border-black/5 rounded-xl text-center text-2xl font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-tertiary text-white py-5 rounded-2xl font-bold shadow-xl shadow-tertiary/20 flex items-center justify-center gap-2"
              >
                Verify Identity <ArrowRight size={20} />
              </button>
              <button onClick={() => setStep(1)} className="w-full text-xs font-bold text-neutral-400">Back to Scan</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-surface-container-low p-6 rounded-3xl border border-black/5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Allocation Details</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Farmer</span>
                  <span className="font-bold">Mumba Chileshe</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Input Type</span>
                  <span className="font-bold">D-Compound Fertilizer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Max Quantity</span>
                  <span className="font-bold">8 Bags</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Quantity to Issue</label>
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center font-bold text-xl">-</button>
                <div className="flex-1 bg-surface-container-low border border-black/5 rounded-2xl py-4 text-center text-2xl font-black">8</div>
                <button className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center font-bold text-xl">+</button>
              </div>
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              Confirm Redemption <CheckCircle2 size={20} />
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary animate-bounce">
                <CheckCircle2 size={56} />
              </div>
              <div>
                <h3 className="text-3xl font-black font-headline">Redeemed!</h3>
                <p className="text-sm text-neutral-500">Voucher #FISP-2026-9921 has been successfully processed.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border-2 border-dashed border-tertiary/20 space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Digital Receipt</p>
                <p className="text-xs font-mono text-neutral-300">TXN-9921-8832-1102</p>
              </div>
              <div className="space-y-3 border-y border-black/5 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Items</span>
                  <span className="font-bold">8 x 50kg D-Compound</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Dealer</span>
                  <span className="font-bold">Zambia Agro Hub Ltd</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Date</span>
                  <span className="font-bold">30 Mar 2026, 14:20</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-surface-container-low py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <Download size={16} /> PDF
                </button>
                <button className="flex-1 bg-surface-container-low py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Done <ArrowRight size={20} />
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black font-headline">Voucher Redemption</h2>
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= i ? "bg-primary" : "bg-black/5"
            )}
          />
        ))}
      </div>

      {renderStep()}
    </div>
  );
};

const AgroDealerDashboard = () => {
  const [isRedeeming, setIsRedeeming] = useState(false);

  if (isRedeeming) {
    return <VoucherRedemptionScreen onBack={() => setIsRedeeming(false)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Agro-Dealer Portal</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Zambia Agro Hub Ltd</h2>
          <p className="text-sm text-neutral-500">License: AD-2024-991</p>
        </div>
        <button
          onClick={() => setIsRedeeming(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <QrCode size={20} /> Redeem Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Redemptions', value: '1,284', trend: '+12%', icon: CheckCircle2 },
          { label: 'Pending Claims', value: 'ZMW 42,500', trend: 'Processing', icon: Wallet },
          { label: 'Stock Alerts', value: '2 Low', trend: 'Action Needed', icon: AlertTriangle },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold uppercase text-neutral-500">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Current Stock Inventory</h3>
            <button className="text-xs font-bold text-primary">Manage Stock</button>
          </div>
          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Input Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Current Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[
                  { name: 'D-Compound Fertilizer', stock: '450 Bags', status: 'GOOD' },
                  { name: 'Urea Fertilizer', stock: '12 Bags', status: 'LOW' },
                  { name: 'Maize Seed (10kg)', stock: '120 Packs', status: 'GOOD' },
                ].map((item) => (
                  <tr key={item.name}>
                    <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-medium">{item.stock}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[9px] font-black uppercase",
                        item.status === 'GOOD' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Recent Redemptions</h3>
            <button className="text-xs font-bold text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Mumba Chileshe', nrc: '102934/11/1', time: '2 mins ago', items: '8 Bags D-Compound' },
              { name: 'Sarah Phiri', nrc: '882103/44/1', time: '1 hour ago', items: '2 Packs Maize Seed' },
              { name: 'John Banda', nrc: '449102/22/1', time: '3 hours ago', items: '4 Bags Urea' },
            ].map((r) => (
              <div key={r.nrc} className="bg-surface-container-low p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-[10px] text-neutral-400">NRC: {r.nrc} • {r.items}</p>
                </div>
                <p className="text-[10px] font-bold text-neutral-400">{r.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};


const AgentDashboard = () => {
  const [showRecording, setShowRecording] = useState(false);

  if (showRecording) {
    return <GrainRecordingScreen onBack={() => setShowRecording(false)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Assigned Depot</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Choma Central Depot</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-tertiary-fixed-dim/20 text-tertiary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <Clock size={16} />
            OFFLINE MODE
          </div>
          <button className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
            <History size={12} /> Sync Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-black/5">
          <Package size={24} className="text-primary mb-4" />
          <p className="text-[10px] font-bold uppercase text-neutral-500">Today's Grain Intake</p>
          <p className="text-4xl font-black font-headline">142 <span className="text-lg font-medium text-neutral-400">Bags</span></p>
        </div>
        <div className="bg-primary-container p-6 rounded-3xl shadow-xl shadow-primary/10 text-white">
          <Users size={24} className="mb-4 opacity-80" />
          <p className="text-[10px] font-bold uppercase opacity-80">Pending Verifications</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-black font-headline">08</p>
            <button className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Verify Farmer' },
            { icon: Scale, label: 'Record Grain', onClick: () => setShowRecording(true) },
            { icon: Receipt, label: 'Generate PRN' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-container-lowest rounded-3xl border border-black/5 hover:bg-primary/5 transition-all group"
            >
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Pending Farmer Queue</h3>
          <button className="text-[10px] font-bold text-primary uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Mutale Kapwepwe', nrc: '482910/11/1', weight: '420kg', crop: 'White Maize' },
            { name: 'Bwalya Mwewa', nrc: '110928/65/1', weight: '1,250kg', crop: 'Soybeans' },
          ].map((item) => (
            <div key={item.nrc} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-black/5">
              <div className="w-12 h-12 bg-surface-container-high rounded-full overflow-hidden">
                <img src={`https://picsum.photos/seed/${item.nrc}/200`} alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs font-bold text-primary">{item.weight}</p>
                </div>
                <p className="text-[10px] text-neutral-400">NRC: {item.nrc}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-high rounded text-[9px] font-bold uppercase">{item.crop}</span>
                </div>
              </div>
              <button className="bg-primary text-white p-2 rounded-xl">
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const GrainRecordingScreen = ({ onBack }: { onBack: () => void }) => {
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

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight">District Admin Dashboard</h2>
          <p className="text-sm text-neutral-500">Lusaka Central District • Friday, Oct 24, 2024</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Registered Farmers', value: '42,890', trend: '+4%', color: 'primary' },
          { label: 'FISP Redemption', value: '76.4%', trend: '85% Target', color: 'primary' },
          { label: 'Active Agro-Dealers', value: '142', trend: 'Dist. Wide', color: 'primary' },
          { label: 'Fraud Alerts', value: '12', trend: 'High Priority', color: 'error', urgent: true },
          { label: 'Pathway B Pending', value: '892', trend: 'In Progress', color: 'tertiary' },
        ].map((kpi) => (
          <div key={kpi.label} className={cn(
            "bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-black/5",
            kpi.urgent && "bg-error-container/20 border-error/20"
          )}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{kpi.label}</p>
            <h3 className={cn("text-2xl font-black font-headline", kpi.urgent ? "text-error" : "text-primary")}>{kpi.value}</h3>
            <p className="text-[10px] font-bold mt-1 opacity-60">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline">Redemption Rate by Ward</h3>
            <button className="text-xs font-bold text-primary flex items-center gap-1">
              Full Report <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Kanyama Ward', value: 92, color: 'bg-primary' },
              { label: 'Chawama Ward', value: 74, color: 'bg-primary/80' },
              { label: 'Kabwata Ward', value: 58, color: 'bg-tertiary' },
              { label: 'Matera Ward', value: 41, color: 'bg-error' },
            ].map((ward) => (
              <div key={ward.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{ward.label}</span>
                  <span>{ward.value}%</span>
                </div>
                <div className="h-10 bg-surface-container-low rounded-2xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ward.value}%` }}
                    className={cn("h-full rounded-2xl", ward.color)}
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-[10px] font-bold text-white">
                    {Math.floor(ward.value * 150)} Redeemed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <h3 className="text-xl font-bold font-headline mb-6">Stock Integrity Heatmap</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const val = Math.floor(Math.random() * 100);
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-white transition-all hover:scale-105 cursor-pointer",
                    val > 70 ? "bg-primary" : val > 30 ? "bg-tertiary" : "bg-error"
                  )}
                >
                  <span className="text-[10px] font-bold">D-{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[8px] opacity-80">{val}%</span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-[10px] font-bold text-neutral-400">
            <span>LEGEND:</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> High</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary" /> Low</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error" /> Alert</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        <h3 className="text-xl font-bold font-headline mb-6">Recent Fraud Alerts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">NRC</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Dealer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Flag Reason</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-neutral-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { nrc: '491022/11/1', dealer: 'Kasama Agro', reason: 'double-dip', time: '14:22' },
                { nrc: '338102/52/1', dealer: 'Lusaka Seeds', reason: 'GPS mismatch', time: '12:05' },
                { nrc: '110928/65/1', dealer: 'Choma Inputs', reason: 'volume anomaly', time: '09:45' },
              ].map((alert) => (
                <tr key={alert.nrc} className="hover:bg-error/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm">{alert.nrc}</td>
                  <td className="px-6 py-4 text-xs text-neutral-500">{alert.dealer}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-error bg-error-container/50 px-2 py-0.5 rounded uppercase">{alert.reason}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400">{alert.time}</td>
                  <td className="px-6 py-4">
                    <button className="text-[10px] font-black uppercase text-primary">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PaymentsDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Financial Oversight</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">Farmer Payments</h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
            Bulk Approve
          </button>
          <button className="bg-surface-container-high px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Disbursed', value: 'ZMW 142.5M', trend: '+12%', icon: Wallet },
          { label: 'Pending Amount', value: 'ZMW 12.8M', trend: '842 Farmers', icon: Clock },
          { label: 'Failed Payments', value: 'ZMW 420K', trend: 'Action Required', icon: AlertTriangle },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold uppercase text-neutral-500">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <div className="flex gap-4">
            <select className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2">
              <option>All Districts</option>
              <option>Lusaka</option>
              <option>Choma</option>
            </select>
            <select className="bg-surface-container-low border-none rounded-xl text-xs font-bold px-4 py-2">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input className="bg-surface-container-low border-none rounded-xl text-xs pl-10 pr-4 py-2 w-64" placeholder="Search farmer or NRC..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Farmer Name</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">NRC</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Qty (Bags)</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Method</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-neutral-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { name: 'Loveness Phiri', nrc: '482910/11/1', qty: 12, amount: 3360, method: 'MoMo', status: 'APPROVED' },
                { name: 'Kelvin Banda', nrc: '110928/65/1', qty: 25, amount: 7000, method: 'Bank', status: 'PENDING' },
                { name: 'Mutale Kapwepwe', nrc: '338102/52/1', qty: 8, amount: 2240, method: 'MoMo', status: 'CANCELLED' },
              ].map((row) => (
                <tr key={row.nrc} className="hover:bg-primary/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-sm">{row.name}</td>
                  <td className="px-8 py-5 text-xs text-neutral-500">{row.nrc}</td>
                  <td className="px-8 py-5 text-xs font-black">{row.qty}</td>
                  <td className="px-8 py-5 text-xs font-black">ZMW {row.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-xs font-medium text-neutral-500">{row.method}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      row.status === 'APPROVED' ? "bg-primary/10 text-primary" :
                        row.status === 'PENDING' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RegionalAdminDashboard = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Institutional Oversight</span>
        <h2 className="text-4xl font-black font-headline tracking-tight">Beneficiary Analytics</h2>
      </div>
      <div className="flex gap-3">
        <button className="bg-surface-container-high px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2">
          <MapIcon size={16} /> Toggle Map View
        </button>
        <button className="bg-primary text-white px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl shadow-primary/20">
          <QrCode size={16} /> Confirm Arrival
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-surface-container-lowest p-10 rounded-[3rem] shadow-sm border border-black/5">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-xl font-bold font-headline">Redemption Rate Over Time</h3>
            <p className="text-sm text-neutral-500">Voucher activation velocity across all districts</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black font-headline text-primary">84.2%</p>
            <p className="text-xs font-bold text-primary-container">+5.4% from LW</p>
          </div>
        </div>
        <div className="h-64 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path
              d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40 T1000,60"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
            />
            <path
              d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40 T1000,60 V200 H0 Z"
              fill="currentColor"
              className="text-primary/10"
            />
          </svg>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'].map(wk => <span key={wk}>{wk}</span>)}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-[3rem] flex flex-col">
        <h3 className="text-xl font-bold font-headline mb-8">Stock Levels by Dealer</h3>
        <div className="space-y-6 flex-1">
          {[
            { label: 'Lusaka Agro Depot', val: 92 },
            { label: 'Copperbelt Seeds Ltd', val: 45 },
            { label: 'Southern Farmers Hub', val: 78 },
            { label: 'Eastern Millers Co.', val: 12 },
          ].map(dealer => (
            <div key={dealer.label} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{dealer.label}</span>
                <span>{dealer.val}%</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dealer.val}%` }}
                  className={cn("h-full rounded-full", dealer.val < 20 ? "bg-error" : "bg-primary")}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-4 border border-black/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all">
          View All Inventory
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-black/5 overflow-hidden relative">
        <h3 className="text-xl font-bold font-headline mb-2">Disbursement Map</h3>
        <p className="text-sm text-neutral-500 mb-8">ZMW payout concentration by district</p>
        <div className="h-80 bg-surface-container-low rounded-3xl flex items-center justify-center relative">
          <MapIcon size={120} className="text-primary/10" />
          <div className="absolute top-10 right-10 glass-panel p-4 rounded-2xl shadow-xl border border-black/5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase">Choma District</p>
            <p className="text-xl font-black text-primary">K12.4M</p>
            <p className="text-[9px] font-bold text-primary-container">98% Payout Success</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-surface-container-high p-8 rounded-[3rem]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-error-container text-error rounded-2xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Fraud Detection Engine</h3>
              <p className="text-sm text-neutral-500">Flagged anomalies requiring review</p>
            </div>
          </div>
          <span className="bg-error text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">12 Urgent</span>
        </div>

        <div className="space-y-4">
          {[
            { id: '491022/11/1', type: 'double-dip', time: '14:22', status: 'under review' },
            { id: '338102/52/1', type: 'GPS mismatch', time: '12:05', status: 'under review' },
          ].map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">NRC ID</p>
                  <p className="font-bold">{alert.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Flag Type</p>
                  <span className="text-xs font-bold text-error bg-error-container/50 px-2 py-0.5 rounded">{alert.type}</span>
                </div>
              </div>
              <div className="text-right">
                <button className="text-[10px] font-black uppercase text-primary border-b-2 border-primary">Mark Resolved</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = MOCK_USERS[role];

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'vouchers') return <VouchersPanel role={role} />;
    if (activeTab === 'deliveries') return <DeliveriesPanel />;
    if (activeTab === 'stock') return <StockPanel role={role} />;
    if (activeTab === 'logistics') return <LogisticsPanel role={role} />;
    if (activeTab === 'registration') return <RegistrationPanel />;
    if (activeTab === 'payments') return <PaymentsDashboard />;
    if (activeTab === 'security') return <SecurityPanel />;

    switch (role) {
      case 'FARMER': return <FarmerDashboard setActiveTab={setActiveTab} />;
      case 'AGRO_DEALER': return <AgroDealerDashboard />;
      case 'AGENT': return <AgentDashboard />;
      case 'ADMIN': return <AdminDashboard />;
      default: return <FarmerDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <TopBar
        user={user}
        onRoleChange={setRole}
        onMenuToggle={() => setIsSidebarOpen(true)}
        activeTab={activeTab}
      />
      <Sidebar
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="pt-28 pb-32 lg:pb-12 px-4 lg:px-8 lg:pl-80 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={role + activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileNav role={role} activeTab={activeTab} setActiveTab={setActiveTab} onMenuToggle={() => setIsSidebarOpen(true)} />
    </div>
  );
}
