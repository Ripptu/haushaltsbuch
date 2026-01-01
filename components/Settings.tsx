import React from 'react';
import { Settings as SettingsIcon, Shield, Database, Bell, User, Monitor, Github, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onReset: () => void;
}

const Settings: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 min-h-screen">
       <motion.div 
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5"
        >
         <SettingsIcon className="text-zinc-500" size={24} />
         <h2 className="text-2xl font-light text-white">Settings</h2>
       </motion.div>

       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.1 }}
         className="space-y-8"
        >
         {/* Profile Section */}
         <section className="space-y-4">
           <h3 className="text-xs text-zinc-500 font-medium uppercase tracking-widest pl-2">Profile</h3>
           <div className="bg-vamela-surface border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
             <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  V
                </div>
                <div className="flex-1">
                  <div className="text-zinc-200 font-medium">Designer Account</div>
                  <div className="text-zinc-500 text-sm">pro@vamela.design</div>
                </div>
                <button className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                  Edit
                </button>
             </div>
           </div>
         </section>

         {/* Preferences Section */}
         <section className="space-y-4">
           <h3 className="text-xs text-zinc-500 font-medium uppercase tracking-widest pl-2">Preferences</h3>
           <div className="bg-vamela-surface border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
             <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <Monitor size={18} className="text-zinc-400" />
                   <span className="text-zinc-200 text-sm">Appearance</span>
                </div>
                <span className="text-xs text-zinc-500">Dark Mode</span>
             </div>
             <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <Bell size={18} className="text-zinc-400" />
                   <span className="text-zinc-200 text-sm">Notifications</span>
                </div>
                <div className="w-8 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 relative">
                  <div className="absolute right-0 top-[-1px] w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
                </div>
             </div>
             <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <Shield size={18} className="text-zinc-400" />
                   <span className="text-zinc-200 text-sm">Security</span>
                </div>
                <span className="text-xs text-zinc-500">2FA Enabled</span>
             </div>
           </div>
         </section>

          {/* Data Section */}
         <section className="space-y-4">
           <h3 className="text-xs text-zinc-500 font-medium uppercase tracking-widest pl-2">Data Management</h3>
           <div className="bg-vamela-surface border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
             <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <Database size={18} className="text-zinc-400" />
                   <span className="text-zinc-200 text-sm">Export Data (CSV)</span>
                </div>
             </div>
             <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <Github size={18} className="text-zinc-400" />
                   <span className="text-zinc-200 text-sm">Sync with GitHub</span>
                </div>
             </div>
           </div>
         </section>
         
         <div className="pt-8 pb-8 flex justify-center">
            <button 
              onClick={onReset}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-medium"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
              Reset application state
            </button>
         </div>
       </motion.div>
    </div>
  );
};

export default Settings;