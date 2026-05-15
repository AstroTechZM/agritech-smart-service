/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. PROPS DESTRUCTURING:
 *    - Instead of saying 'props.user', we use { user, onMenuToggle } 
 *      directly in the function arguments. It's a shorthand way to grab 
 *      the data we need.
 */
import { Package, Bell, CheckCircle2 } from 'lucide-react'; // Visual Icons
import { User } from '../../types'; // Data structure definition
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_DEFAULTS } from '@/src/constants';

export const TopBar = ({ user, onMenuToggle, activeTab }: {
  user: User;
  onMenuToggle: () => void;
  activeTab: string;
}) => {
  return (
    /**
     * 2. FIXED POSITIONING:
     *    - 'fixed' keeps the TopBar at the top of the screen even when the user scrolls.
     *    - 'z-50' ensures it stays ON TOP of other elements.
     */
    <header className="fixed top-0 right-0 left-0 h-20 glass-panel border-b border-black/5 z-50 px-4 lg:px-8 flex items-center justify-between">
      
      {/* LEFT SIDE: Mobile Menu & Logo */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-neutral-500 hover:bg-black/5 rounded-xl transition-all"
        >
          <Package size={24} className="text-primary" />
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm lg:text-base font-black font-headline text-neutral-900 leading-none">
                AgriTech<span className="text-primary">Portal</span>
              </h1>
              {/* 3. DYNAMIC DATA: This text changes based on what page you are on */}
              <span className="text-[10px] lg:text-xs font-bold text-neutral-400 uppercase tracking-widest lg:mt-0.5">
                {activeTab}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: User Profile & Notifications */}
      <div className="flex items-center gap-2 lg:gap-6">

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications Button */}
          <button className="p-2.5 text-neutral-500 hover:bg-black/5 rounded-2xl relative transition-all hover:scale-110">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>

          {/* 4. USER PROFILE: Shows the logged-in user's name and role */}
          <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-black/5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-neutral-900 leading-none">{user.name || user.first_name}</p>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="relative">
              <img src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'} alt="Avatar" className="w-9 h-9 lg:w-11 lg:h-11 rounded-2xl border-2 border-primary/10 object-cover shadow-md" />
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
