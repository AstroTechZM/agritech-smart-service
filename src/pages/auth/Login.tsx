import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Landmark, Smartphone } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole, User } from '@/src/types';
import { MOCK_USERS } from '@/src/data/mockData';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
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
            {(Object.values(UserRole)).map((r) => (
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
                placeholder={role === UserRole.FARMER || role === UserRole.AGENT ? "000000/00/1" : "email@example.zm"}
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
            onClick={() => onLogin(MOCK_USERS[role])}
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

export default Login;
