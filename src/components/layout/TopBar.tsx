/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. PROPS DESTRUCTURING:
 *    - Instead of saying 'props.user', we use { user, onMenuToggle } 
 *      directly in the function arguments. It's a shorthand way to grab 
 *      the data we need.
 */
import { Package, Search, Bell, CheckCircle2, History, X, ChevronRight, ArrowRight } from 'lucide-react'; // Visual Icons
import { User } from '../../types'; // Data structure definition
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_DEFAULTS } from '@/src/constants';

export const TopBar = ({ user, onMenuToggle, activeTab }: {
  user: User;
  onMenuToggle: () => void;
  activeTab: string;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="w-8 h-8 bg-primary rounded-lg hidden lg:hidden items-center justify-center text-white">
              <Package size={18} />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <h1 className="text-lg lg:text-xl font-black text-primary font-headline tracking-tighter leading-none">
                Agri<span className="text-neutral-900">Tech</span>
              </h1>
              <div className="hidden lg:block w-px h-4 bg-black/10 mx-1" />
              {/* 3. DYNAMIC DATA: This text changes based on what page you are on */}
              <span className="text-[10px] lg:text-xs font-bold text-neutral-400 uppercase tracking-widest lg:mt-0.5">
                {activeTab}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Search & User Profile */}
      <div className="flex items-center gap-2 lg:gap-6">
        {/* Search Bar: Hidden on small screens */}
        <div className="hidden md:block relative">
          <div className="flex items-center bg-surface-container-low rounded-2xl px-4 py-2 border border-black/5">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search records..."
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 lg:w-64"
            />
            {isSearchOpen && (
              <button onClick={() => setIsSearchOpen(false)} className="text-neutral-400 hover:text-neutral-900">
                <X size={16} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <>
                {/* Search Modal Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => setIsSearchOpen(false)}
                />
                
                {/* Search Results Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-96 bg-surface-container-lowest rounded-3xl shadow-2xl border border-black/5 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recent Searches</p>
                  </div>
                  <div className="p-2">
                    {['D-Compound Fertilizer', `Farmer: ${MOCK_DEFAULTS.FARMER_NAME}`, 'Voucher #FRA-9921'].map((item, idx) => (
                      <button key={idx} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-colors group">
                        <div className="flex items-center gap-3">
                          <History size={16} className="text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-700">{item}</span>
                        </div>
                        <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <p className="text-xs text-primary font-bold">Advanced Search</p>
                    <ArrowRight size={16} className="text-primary" />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
