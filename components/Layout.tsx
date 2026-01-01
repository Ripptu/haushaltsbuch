import React from 'react';
import { Plus, ChevronUp } from 'lucide-react';
import { View } from '../types';
import { motion, useAnimation } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  onOpenCmd: () => void;
  currentView: View;
  onChangeView: (view: View) => void;
}

const Layout: React.FC<Props> = ({ children, onOpenCmd, currentView, onChangeView }) => {
  const controls = useAnimation();

  const getLinkClass = (view: View) => {
    const isActive = currentView === view;
    return `cursor-pointer transition-colors ${
      isActive ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
    }`;
  };

  return (
    <div className="min-h-screen bg-vamela-bg text-zinc-200 font-sans selection:bg-zinc-800 pb-32 md:pb-0 relative overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div 
              className="text-xl font-semibold tracking-tighter text-white flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => onChangeView('dashboard')}
            >
              <div className="w-3 h-3 rounded-sm bg-blue-500 shadow-[0_0_10px_#3B82F6]" />
              Vamela.
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button 
                onClick={() => onChangeView('dashboard')} 
                className={getLinkClass('dashboard')}
              >
                Übersicht
              </button>
              <button 
                onClick={() => onChangeView('history')} 
                className={getLinkClass('history')}
              >
                Historie
              </button>
              <button 
                onClick={() => onChangeView('settings')} 
                className={getLinkClass('settings')}
              >
                Einstellungen
              </button>
            </div>
          </div>

          {/* Quick Action Desktop */}
          <div className="hidden md:flex items-center gap-4">
             <div className="text-xs text-zinc-600 font-mono">CMD + K</div>
            <button 
              onClick={onOpenCmd}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-medium text-sm"
            >
              <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
              <span>Neu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Added explicit z-index and relative positioning to fix mobile overlay issues */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Mobile Swipe Up Action Zone */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 h-24 flex items-end justify-center pointer-events-none">
        {/* Actual Interactable Area */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.y < -40) {
              onOpenCmd();
            }
          }}
          className="pointer-events-auto w-full h-20 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-end pb-6 cursor-grab active:cursor-grabbing"
        >
          <motion.div 
             animate={{ y: [0, -5, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-1.5 rounded-full bg-zinc-700/50 backdrop-blur-md border border-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium flex items-center gap-1">
              <ChevronUp size={10} /> Swipe für Neu
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Floating Action Button (Alternative/Fallback) - Hidden now in favor of swipe, 
          but can keep as a visual anchor if needed. Let's remove to enforce swipe. */}

      {/* Floating Gradient Background Ambient */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600 blur-[120px] opacity-[0.08]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

    </div>
  );
};

export default Layout;