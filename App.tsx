import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import CommandMenu from './components/CommandMenu';
import { Transaction, View } from './types';
import { generateMockTransactions } from './services/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

const STORAGE_KEY = 'vamela_transactions_v1';

const App: React.FC = () => {
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Undo State
  const [lastDeleted, setLastDeleted] = useState<Transaction | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  
  // Initialize state from LocalStorage or fallback to Mock Data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
    return generateMockTransactions();
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Keyboard shortcut for CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide toast automatically
  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => setShowUndo(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'created_at'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setTransactions(prev => [transaction, ...prev]);
    setIsCmdOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    // 1. Find the transaction
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;

    // 2. Store for undo
    setLastDeleted(txToDelete);
    setShowUndo(true);

    // 3. Delete immediately (Optimistic UI)
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleUndoDelete = () => {
    if (lastDeleted) {
      setTransactions(prev => [lastDeleted, ...prev]); // Add back
      setShowUndo(false);
      setLastDeleted(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to delete all data and reset to defaults?')) {
      const defaults = generateMockTransactions();
      setTransactions(defaults);
      setCurrentView('dashboard');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} onDelete={handleDeleteTransaction} />;
      case 'history':
        return <History transactions={transactions} onDelete={handleDeleteTransaction} />;
      case 'settings':
        return <Settings onReset={handleResetData} />;
      default:
        return <Dashboard transactions={transactions} onDelete={handleDeleteTransaction} />;
    }
  };

  return (
    <>
      <Layout 
        onOpenCmd={() => setIsCmdOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
      >
        {renderView()}
      </Layout>
      
      <CommandMenu 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onAdd={handleAddTransaction}
      />

      {/* Undo Toast Notification */}
      <AnimatePresence>
        {showUndo && (
          <div className="fixed bottom-24 md:bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto bg-zinc-900 border border-zinc-800 text-white shadow-2xl rounded-full pl-4 pr-2 py-2 flex items-center gap-4 min-w-[300px]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">Transaction deleted</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={handleUndoDelete}
                className="px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={12} />
                Undo
              </button>
              <button 
                onClick={() => setShowUndo(false)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;