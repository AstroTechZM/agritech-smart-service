import React, { useState, useEffect } from 'react';
import { Bell, Globe, Moon, Sun, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  DARK_MODE: 'agritech_dark_mode',
  LANGUAGE: 'agritech_language',
  NOTIFICATIONS: 'agritech_notifications',
};

// Demo translations for 5 key strings
const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    title: 'System Settings',
    subtitle: 'Preferences',
    notifications: 'Push Notifications',
    notificationsDesc: 'Receive alerts for deliveries, voucher updates, and transactions.',
    language: 'Language Preference',
    languageDesc: 'Select your preferred language for the application interface.',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch to a darker theme for better visibility at night.',
  },
  Nyanja: {
    title: 'Zikhazikiko za Dongosolo',
    subtitle: 'Zokonda',
    notifications: 'Zodziwitsa pa Foni',
    notificationsDesc: 'Landilani zodziwitsa za kufikitsa, mavawutchisi, ndi malipiro.',
    language: 'Chilankhulo',
    languageDesc: 'Sankhani chilankhulo chanu cha pulogalamu.',
    darkMode: 'Mtungo Wakuda',
    darkModeDesc: 'Sinthani kukhala mtungo wakuda usiku.',
  },
  Bemba: {
    title: 'Ifisango fya System',
    subtitle: 'Ifya kusankwa',
    notifications: 'Amakande ku Foni',
    notificationsDesc: 'Pobeni amakande pa delivery, ma voucher, na malipilo.',
    language: 'Lulimi',
    languageDesc: 'Sankeni lulimi lwenu lwa application.',
    darkMode: 'Ubusuku Mode',
    darkModeDesc: 'Cindeni ku ubusuku mode pa bushiku.',
  },
  Tonga: {
    title: 'Micelo ya Cilengwa',
    subtitle: 'Zisankwa',
    notifications: 'Zilongezi ku Foni',
    notificationsDesc: 'Amukutu zilongezi za kufilikiza, ma voucher, na malipilo.',
    language: 'Lulimi',
    languageDesc: 'Sankani lulimi lwanu la application.',
    darkMode: 'Mode ya Busiku',
    darkModeDesc: 'Sinthani ku mode ya busiku usiku.',
  },
};

export const Settings = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  });
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'English';
  });
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) === 'true';
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  // Apply dark mode on mount and toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
  }, [darkMode]);

  // Persist language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const handleDarkModeToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    toast.success(next ? 'Dark mode enabled.' : 'Light mode restored.');
  };

  const handleNotificationsToggle = async () => {
    if (!pushEnabled) {
      // Requesting permission
      if (!('Notification' in window)) {
        toast.error('This browser does not support push notifications.');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, 'true');
        toast.success('Push notifications enabled.');
        // Fire a demo notification
        new Notification('Agri-Tech Portal', {
          body: 'Notifications are now active for your account.',
          icon: '/favicon.ico',
        });
      } else if (permission === 'denied') {
        toast.error('Notification permission denied. Please allow it in your browser settings.');
      } else {
        toast.info('Notification permission dismissed.');
      }
    } else {
      setPushEnabled(false);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, 'false');
      toast.info('Push notifications disabled.');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    toast.success(`Language changed to ${lang}.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">{t.subtitle}</span>
        <h2 className="text-3xl font-black font-headline tracking-tight">{t.title}</h2>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm divide-y divide-black/5">
        
        {/* Notifications */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              <Bell size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold font-headline text-neutral-900">{t.notifications}</h4>
              <p className="text-sm text-neutral-500 font-medium">{t.notificationsDesc}</p>
              {pushEnabled && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Active
                </span>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={pushEnabled}
              onChange={handleNotificationsToggle}
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
              <h4 className="text-lg font-bold font-headline text-neutral-900">{t.language}</h4>
              <p className="text-sm text-neutral-500 font-medium">{t.languageDesc}</p>
            </div>
          </div>
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="bg-surface-container-low border border-black/5 rounded-2xl px-4 py-2 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none shrink-0"
          >
            <option>English</option>
            <option>Nyanja</option>
            <option>Bemba</option>
            <option>Tonga</option>
          </select>
        </div>

        {/* Dark Mode */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${darkMode ? 'bg-primary/10 text-primary' : 'bg-neutral-800 text-white'}`}>
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </div>
            <div>
              <h4 className="text-lg font-bold font-headline text-neutral-900">{t.darkMode}</h4>
              <p className="text-sm text-neutral-500 font-medium">{t.darkModeDesc}</p>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 block">
                Currently: {darkMode ? 'Dark' : 'Light'}
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
            <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
