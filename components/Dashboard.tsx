import React, { useMemo, useState } from 'react';
import TrendChart from './TrendChart';
import TransactionCard from './TransactionCard';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Calendar, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

type TimeRange = 'all' | 'month';

const Dashboard: React.FC<Props> = ({ transactions }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  
  // Filter Transactions based on Time Range
  const filteredTransactions = useMemo(() => {
    if (timeRange === 'all') return transactions;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const d = new Date(t.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [transactions, timeRange]);

  // Calculate Totals based on filtered data
  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const amt = t.amount;
      if (t.type === 'income') {
        acc.totalIncome += amt;
        acc.totalBalance += amt;
      } else {
        acc.totalExpenses += amt;
        acc.totalBalance -= amt;
      }
      return acc;
    }, { totalBalance: 0, totalIncome: 0, totalExpenses: 0 });
  }, [filteredTransactions]);

  // Group by Month (Use ALL transactions for context in the sidebar, or filtered? 
  // Usually sidebars show history, but if filtered to month, showing only one makes sense for focus.
  // Let's use filteredTransactions to be consistent with the user request "only display for this month")
  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number, expense: number }> = {};
    
    // We use filteredTransactions here so the sidebar also reflects the view
    filteredTransactions.forEach(t => {
      const date = new Date(t.created_at);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!months[monthKey]) months[monthKey] = { income: 0, expense: 0 };
      
      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expense += t.amount;
      }
    });

    return Object.entries(months).map(([key, val]) => ({
      month: key,
      ...val,
      net: val.income - val.expense
    }));
  }, [filteredTransactions]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header / Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           {/* Optional Greeting or Title could go here */}
        </div>
        
        <div className="bg-zinc-900/50 p-1 rounded-xl border border-white/5 inline-flex self-start md:self-auto">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              timeRange === 'all' 
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Clock size={14} />
            All Time
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              timeRange === 'month' 
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calendar size={14} />
            This Month
          </button>
        </div>
      </div>

      {/* Hero Section - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-vamela-surface border border-white/5 p-8 flex flex-col justify-between h-[340px]"
        >
          <div className="z-10">
            <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-1">
              {timeRange === 'all' ? 'Total Balance' : 'Monthly Balance'}
            </h3>
            <div className="text-5xl md:text-6xl font-semibold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-white/5">
                 {timeRange === 'all' ? 'Current Net Worth' : 'Net Result This Month'}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-[200px] opacity-80">
             {/* Pass filtered transactions to chart */}
             <TrendChart data={filteredTransactions} />
          </div>
        </motion.div>

        {/* Quick Stats Column */}
        <div className="space-y-6 flex flex-col h-[340px]">
            {/* Income */}
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 rounded-3xl bg-vamela-surface border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
            >
               <div className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-emerald-500">
                  <TrendingUp size={20} />
               </div>
               <span className="text-zinc-500 text-xs uppercase tracking-wider">
                 {timeRange === 'all' ? 'Total Income' : 'Income (Month)'}
               </span>
               <span className="text-3xl font-medium text-white mt-1 tracking-tight">
                 ${totalIncome.toLocaleString()}
               </span>
            </motion.div>

            {/* Expenses */}
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 rounded-3xl bg-vamela-surface border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-rose-500/30 transition-colors"
            >
              <div className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-rose-500">
                  <TrendingDown size={20} />
               </div>
               <span className="text-zinc-500 text-xs uppercase tracking-wider">
                 {timeRange === 'all' ? 'Total Expenses' : 'Expenses (Month)'}
               </span>
               <span className="text-3xl font-medium text-white mt-1 tracking-tight">
                 ${totalExpenses.toLocaleString()}
               </span>
            </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent Transactions List - Left 2/3 */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-light text-white flex items-center gap-2">
                <Activity className="text-zinc-600" size={20} />
                {timeRange === 'all' ? 'Recent Activity' : 'Activity This Month'}
              </h2>
          </div>
          
          <div className="grid gap-3">
            {filteredTransactions.slice(0, 10).map((t, idx) => (
              <TransactionCard key={t.id} transaction={t} index={idx} />
            ))}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-xl">
                No transactions found for this period.
              </div>
            )}
          </div>
        </div>

        {/* Monthly Breakdown - Right 1/3 */}
        <div className="md:col-span-1">
           <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-light text-white flex items-center gap-2">
                <Calendar className="text-zinc-600" size={20} />
                Overview
              </h2>
          </div>
          <div className="space-y-4">
             {monthlyData.map((m, i) => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 + (i * 0.1) }}
                 key={m.month} 
                 className="p-4 rounded-xl bg-vamela-surface border border-white/5"
               >
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-sm font-medium text-white">{m.month}</span>
                   <span className={`text-xs font-mono px-2 py-0.5 rounded border ${m.net >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                     {m.net >= 0 ? '+' : ''}{m.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                   </span>
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-xs text-zinc-500">
                     <span>Income</span>
                     <span className="text-emerald-500/80">+{m.income.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs text-zinc-500">
                     <span>Expenses</span>
                     <span className="text-zinc-400">-{m.expense.toLocaleString()}</span>
                   </div>
                 </div>
               </motion.div>
             ))}
              {monthlyData.length === 0 && (
                 <div className="text-zinc-600 text-xs">No data available.</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;