import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Landmark, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole, User } from '@/types';
import { useFarmers } from '@/context/FarmerContext';
import { toast } from 'sonner';
import { api } from '@/services';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier) {
      toast.error("Please enter your NRC or Email.");
      return;
    }
    if (!password) {
      toast.error("Please enter your secure PIN / Password.");
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate via backend API with identifier and password
      const response = await api.login(identifier, password, '');
      const { user, token } = response;

      localStorage.setItem('agritech_token', token);
      onLogin(user);
      toast.success(`Welcome back, ${user.name || user.firstName || 'User'}!`);
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 text-center">Secure Digital Services • Zambia</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                NRC Number or Work Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 000000/00/1 or admin@mafs.gov.zm"
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-[9px] text-neutral-400 font-medium ml-1">Enter your registered NRC or official work email.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Secure PIN / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full primary-gradient text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Login to Portal'}
          </button>

          <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 items-start border border-primary/10">
            <ShieldAlert size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-primary/80 font-medium leading-relaxed">
              <span className="font-bold">Security Note:</span> This is a secure government portal. Unauthorized access is strictly prohibited and monitored.
            </p>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-400 bg-surface-container-lowest px-2">New Farmer?</div>
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full bg-tertiary text-white py-4 rounded-2xl font-black font-headline text-lg shadow-xl shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Register My Farm
          </button>
        </div>
      </motion.div>
      <p className="mt-8 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Official Government System • 2026</p>
    </div>
  );
};

export default Login;