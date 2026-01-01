import React from 'react';
import { Plus } from 'lucide-react';
import { View } from '../types';

interface Props {
  children: React.ReactNode;
  onOpenCmd: () => void;
  currentView: View;
  onChangeView: (view: View) => void;
}

const Layout: React.FC<Props> = ({ children, onOpenCmd, currentView, onChangeView }) => {
  
  const getLinkClass = (view: View) => {
    const isActive = currentView === view;
    return `cursor-pointer transition-colors ${
      isActive ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
    }`;
  };

  return (
    <div className="min-h-screen bg-vamela-bg text-zinc-200 font-sans selection:bg-zinc-800 pb-20 md:pb-0">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b border-white/5 bg-black/50">
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
                Dashboard
              </button>
              <button 
                onClick={() => onChangeView('history')} 
                className={getLinkClass('history')}
              >
                History
              </button>
              <button 
                onClick={() => onChangeView('settings')} 
                className={getLinkClass('settings')}
              >
                Settings
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
              <span>Add New</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-0">
        {children}
      </main>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={onOpenCmd}
          className="h-14 w-14 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center active:scale-90 transition-all"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Floating Gradient Background Ambient */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600 blur-[120px] opacity-[0.08]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

    </div>
  );
};

export default Layout;