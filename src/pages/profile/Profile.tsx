import React, { useState } from 'react';
import { User } from '@/src/types';
import { UserRole } from '@/src/types';
import { User as UserIcon, Mail, Phone, MapPin, Shield, Edit3, LogOut, Lock, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/src/services/api';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onSave: (updates: Partial<User>) => void;
}

export const Profile = ({ user, onLogout, onSave }: ProfileProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.cell_num ? `0${user.cell_num}` : '',
    nrc: user.nrc || ''
  });

  // Change Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityPrefs, setSecurityPrefs] = useState({
    twoFactor: false,
    emailAlerts: true,
    loginNotifications: true
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile(profileData);
      onSave({ 
        name: profileData.name, 
        email: profileData.email,
        nrc: profileData.nrc,
        cell_num: profileData.phone.startsWith('0') ? profileData.phone.substring(1) : profileData.phone
      });
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      email: user.email || '',
      phone: user.cell_num ? `0${user.cell_num}` : '',
      nrc: user.nrc || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwords.current) {
      toast.error('Please enter your current password.');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    // Simulated success
    setShowPasswordModal(false);
    setPasswords({ current: '', newPass: '', confirm: '' });
    toast.success('Password changed successfully.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Account</span>
          <h2 className="text-3xl font-black font-headline tracking-tight">My Profile</h2>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-headline"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              className="bg-surface-container-low text-neutral-600 px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-all font-headline"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all font-headline"
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
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
          <h3 className="text-2xl font-black font-headline text-neutral-900">{profileData.name}</h3>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{user.role.replace('_', ' ')}</p>
          
          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500">
                <Mail size={18} />
                <span className="text-xs font-bold">Email</span>
              </div>
              {isEditing ? (
                <input 
                  className="bg-white border-none rounded-lg px-2 py-1 text-xs font-medium w-1/2"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              ) : (
                <span className="text-xs font-medium text-neutral-900">{profileData.email || 'Not provided'}</span>
              )}
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500">
                <Phone size={18} />
                <span className="text-xs font-bold">Phone</span>
              </div>
              {isEditing ? (
                <input 
                  className="bg-white border-none rounded-lg px-2 py-1 text-xs font-medium w-1/2"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              ) : (
                <span className="text-xs font-medium text-neutral-900">{profileData.phone || 'Not provided'}</span>
              )}
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
                {isEditing ? (
                  <input 
                    className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                ) : (
                  <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium">{profileData.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400">NRC Number</label>
                {isEditing ? (
                  <input 
                    className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20"
                    value={profileData.nrc}
                    onChange={(e) => setProfileData({...profileData, nrc: e.target.value})}
                  />
                ) : (
                  <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium">{profileData.nrc || 'Pending Verification'}</div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400">District / Region</label>
                <div className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-400" />
                  {user.district || 'Zambia'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
            <h4 className="text-lg font-bold font-headline mb-2 text-primary">Account Security</h4>
            <p className="text-xs text-neutral-600 font-medium mb-6">Manage your password and security settings to keep your account safe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-6">
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Lock size={14} /> Change Password
                </button>
                <button 
                  onClick={() => setShowSecurityModal(true)}
                  className="bg-white px-6 py-3 rounded-xl font-bold text-xs text-neutral-700 shadow-sm hover:shadow-md transition-all"
                >
                  Security Settings
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

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-sm shadow-2xl border border-black/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Security</span>
                  <h3 className="text-2xl font-black font-headline">Change Password</h3>
                </div>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-black/5 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {(['current', 'newPass', 'confirm'] as const).map((field) => {
                  const labels: Record<string, string> = {
                    current: 'Current Password',
                    newPass: 'New Password',
                    confirm: 'Confirm New Password'
                  };
                  return (
                    <div key={field} className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">{labels[field]}</label>
                      <div className="relative">
                        <input
                          type={showPw[field] ? 'text' : 'password'}
                          value={passwords[field]}
                          onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                          placeholder="••••••••"
                          className="w-full p-4 pr-12 bg-surface-container-low border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                        >
                          {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={handleChangePassword}
                  className="w-full mt-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Security Settings Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowSecurityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest p-8 rounded-[3rem] w-full max-w-md shadow-2xl border border-black/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Account</span>
                  <h3 className="text-2xl font-black font-headline">Security Preferences</h3>
                </div>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-black/5 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">Two-Factor Authentication</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Via SMS or App</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSecurityPrefs({...securityPrefs, twoFactor: !securityPrefs.twoFactor});
                      toast.success(`2FA ${!securityPrefs.twoFactor ? 'enabled' : 'disabled'}`);
                    }}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      securityPrefs.twoFactor ? "bg-primary" : "bg-neutral-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      securityPrefs.twoFactor ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">Email Security Alerts</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Login & Transfer Alerts</p>
                  </div>
                  <button 
                    onClick={() => setSecurityPrefs({...securityPrefs, emailAlerts: !securityPrefs.emailAlerts})}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      securityPrefs.emailAlerts ? "bg-primary" : "bg-neutral-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      securityPrefs.emailAlerts ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>

                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default Profile;
