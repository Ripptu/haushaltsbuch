import React, { useMemo } from 'react';
import { Transaction } from '../types';
import TransactionCard from './TransactionCard';
import { Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  transactions: Transaction[];
}

const History: React.FC<Props> = ({ transactions }) => {
  // Group by month
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    // Ensure sorted by date desc
    const sorted = [...transactions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    sorted.forEach(t => {
      const date = new Date(t.created_at);
      const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [transactions]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-6 border-b border-white/5"
      >
        <h2 className="text-2xl font-light text-white flex items-center gap-3">
          <Calendar className="text-zinc-600" size={24} />
          Transaction History
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:text-white hover:border-zinc-700 transition-colors">
          <Filter size={14} />
          <span>Filter</span>
        </button>
      </motion.div>

      <div className="space-y-10">
        {Object.entries(grouped).map(([month, txs], groupIndex) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            key={month} 
            className="space-y-4"
          >
             <div className="flex items-center justify-between sticky top-20 bg-vamela-bg/95 backdrop-blur py-3 z-10 border-b border-dashed border-zinc-800/50">
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                  {month}
                </h3>
                <span className="text-xs font-mono text-zinc-600">
                  {(txs as Transaction[]).length} transactions
                </span>
             </div>
             <div className="grid gap-3">
               {(txs as Transaction[]).map((t, idx) => (
                 <TransactionCard key={t.id} transaction={t} index={idx} />
               ))}
             </div>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No transactions found. Start by adding one with CMD+K.
          </div>
        )}
      </div>
    </div>
  );
};

export default History;