import React, { useState } from 'react';
import { Bell, Globe, Moon, Shield, Smartphone } from 'lucide-react';

export const Settings = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">Preferences</span>
        <h2 className="text-3xl font-black font-headline tracking-tight">System Settings</h2>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm divide-y divide-black/5">
        
        {/* Notifications */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              <Bell size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold font-headline text-neutral-900">Push Notifications</h4>
              <p className="text-sm text-neutral-500 font-medium">Receive alerts for deliveries, voucher updates, and transactions.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={pushEnabled}
              onChange={() => setPushEnabled(!pushEnabled)}
            />
            <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Language */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold font-headline text-neutral-900">Language Preference</h4>
              <p className="text-sm text-neutral-500 font-medium">Select your preferred language for the application interface.</p>
            </div>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-surface-container-low border border-black/5 rounded-2xl px-4 py-2 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option>English</option>
            <option>Nyanja</option>
            <option>Bemba</option>
            <option>Tonga</option>
          </select>
        </div>

        {/* Theme */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-neutral-800 text-white rounded-2xl flex items-center justify-center shrink-0">
              <Moon size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold font-headline text-neutral-900">Dark Mode</h4>
              <p className="text-sm text-neutral-500 font-medium">Switch to a darker theme for better visibility at night.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
