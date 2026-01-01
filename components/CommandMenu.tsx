import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CornerDownLeft, X } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id' | 'created_at'>) => void;
}

const CommandMenu: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setType('expense');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!amount) return;

    onAdd({
      amount: parseFloat(amount),
      description: description || (type === 'income' ? 'Income' : 'Expense'),
      category: 'Uncategorized', // Simplified for now
      type: type,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        {/* Backdrop */}
        <div className="fixed inset-0 z-50 flex items-end md:items-start justify-center md:pt-[20vh] px-0 md:px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full md:max-w-lg bg-[#0F0F10] border-t md:border border-zinc-800 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full md:h-auto pb-8 md:pb-0">
              
              {/* Drag Handle for mobile visual cue */}
              <div className="md:hidden w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-zinc-800" />
              </div>

              {/* Header */}
              <div className="px-6 pt-4 pb-2 md:py-3 border-b border-transparent md:border-white/5 flex items-center justify-between md:bg-zinc-900/50">
                <span className="hidden md:block text-xs font-medium text-zinc-500 uppercase tracking-wider">Add Transaction</span>
                <span className="md:hidden text-lg font-medium text-white">New Transaction</span>
                
                <button 
                  type="button" 
                  onClick={onClose}
                  className="md:hidden p-2 -mr-2 text-zinc-500 hover:text-white"
                >
                  <X size={24} />
                </button>

                {/* Desktop Toggle (hidden on mobile) */}
                <div className="hidden md:flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                  <button 
                    type="button"
                    onClick={() => setType('expense')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${type === 'expense' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Expense
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('income')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Mobile Toggle (Full Width) */}
              <div className="md:hidden px-6 py-4">
                <div className="flex bg-zinc-900 rounded-2xl p-1.5 border border-zinc-800">
                  <button 
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${type === 'expense' ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' : 'text-zinc-500'}`}
                  >
                    Expense
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-500'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="px-6 py-6 md:py-8 flex items-center justify-center">
                <span className={`text-4xl md:text-4xl font-light mr-2 md:mr-2 self-center ${type === 'income' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                  {type === 'income' ? '+' : '-'}
                </span>
                <input 
                  autoFocus
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none outline-none text-7xl md:text-5xl font-semibold text-white placeholder-zinc-800 w-full text-center caret-blue-500 p-0 m-0"
                />
              </div>

              {/* Description Input */}
              <div className="px-6 pb-6 md:p-2">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="What was this for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800/50 focus:border-zinc-700 rounded-2xl px-5 py-4 text-lg text-zinc-300 placeholder-zinc-600 outline-none transition-all"
                  />
                  <div className="hidden md:block absolute right-2 top-2">
                     <button 
                      type="submit"
                      disabled={!amount}
                      className="h-9 w-9 rounded-lg bg-white text-black flex items-center justify-center disabled:opacity-30 hover:bg-zinc-200 transition-colors"
                     >
                       <CornerDownLeft size={18} />
                     </button>
                  </div>
                </div>
              </div>

              {/* Mobile Submit Button */}
              <div className="md:hidden px-6 pt-2">
                <button
                  type="submit"
                  disabled={!amount}
                  className={`w-full py-4 rounded-2xl text-lg font-medium text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    amount ? (type === 'income' ? 'bg-emerald-600 shadow-lg shadow-emerald-900/20' : 'bg-blue-600 shadow-lg shadow-blue-900/20') : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  Save Transaction
                </button>
              </div>

              {/* Footer Hints (Desktop Only) */}
              <div className="hidden md:flex px-4 py-2 items-center justify-between text-[10px] text-zinc-600 border-t border-white/5 bg-zinc-900/30">
                 <span>Press <span className="font-mono text-zinc-400">ENTER</span> to save</span>
                 <span className="font-mono">VAMELA</span>
              </div>
            </form>
          </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default CommandMenu;