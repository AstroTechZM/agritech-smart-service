import React from 'react';
import { User } from '@/src/types';
import { User as UserIcon, Mail, Phone, MapPin, Shield, Edit3, LogOut } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export const Profile = ({ user, onLogout }: ProfileProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Account</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">My Profile</h2>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-headline">
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar & Basic Info */}
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 flex flex-col items-center text-center shadow-sm">
          <div className="relative mb-6">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'} 
              alt={user.name}
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <Shield size={14} />
            </div>
          </div>
          <h3 className="text-2xl font-black font-headline text-neutral-900">{user.name}</h3>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{user.role.replace('_', ' ')}</p>
          
          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500">
                <Mail size={18} />
                <span className="text-xs font-bold">Email</span>
              </div>
              <span className="text-xs font-medium text-neutral-900">{user.email || 'Not provided'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500">
                <Phone size={18} />
                <span className="text-xs font-bold">Phone</span>
              </div>
              <span className="text-xs font-medium text-neutral-900">{user.cell_num ? `0${user.cell_num}` : 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
            <h4 className="text-lg font-bold font-headline mb-6 text-neutral-900">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400">Full Name</label>
                <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium">{user.name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400">NRC Number</label>
                <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium">{user.nrc || 'Pending Verification'}</div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400">Physical Address</label>
                <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-400" />
                  Zambia (Region info pending)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
            <h4 className="text-lg font-bold font-headline mb-2 text-primary">Account Security</h4>
            <p className="text-xs text-neutral-600 font-medium mb-6">Manage your password and security settings to keep your account safe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-6">
              <div className="flex gap-4">
                <button className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-primary shadow-sm hover:shadow-md transition-all">
                  Change Password
                </button>
                <button className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-neutral-700 shadow-sm hover:shadow-md transition-all">
                  Two-Factor Auth
                </button>
              </div>
              <button 
                onClick={onLogout}
                className="bg-error/10 text-error px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-error hover:text-white transition-all w-full sm:w-auto justify-center"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
