import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Briefcase, Zap, Monitor, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  transaction: Transaction;
  index: number;
  onDelete?: (id: string) => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, index, onDelete }) => {
  const isIncome = transaction.type === 'income';
  
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <ShoppingBag className="w-4 h-4" />;
      case 'software': return <Zap className="w-4 h-4" />;
      case 'hardware': return <Monitor className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ duration: 0.2 }}
      className="group flex items-center justify-between p-4 rounded-xl bg-vamela-surface border border-white/5 hover:border-white/10 transition-colors cursor-default relative overflow-hidden"
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-2.5 rounded-full border border-white/5 ${
          isIncome 
            ? 'bg-emerald-500/10 text-emerald-500' 
            : 'bg-zinc-800/50 text-zinc-400 group-hover:text-zinc-300'
        } transition-colors`}>
          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
            {transaction.description}
          </span>
          <span className="text-xs text-zinc-500 flex items-center gap-1.5">
            {getIcon(transaction.category)}
            {transaction.category} • {new Date(transaction.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 relative z-20">
        <span className={`text-sm font-mono font-medium tracking-tight ${
          isIncome 
            ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' 
            : 'text-zinc-300'
        }`}>
          {isIncome ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stop event bubbling
              onDelete(transaction.id);
            }}
            className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 -mr-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
            title="Delete transaction"
            aria-label="Delete transaction"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionCard;