import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import CommandMenu from './components/CommandMenu';
import { Transaction, View } from './types';
import { generateMockTransactions } from './services/mockData';

const STORAGE_KEY = 'vamela_transactions_v1';

const App: React.FC = () => {
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Initialize state from LocalStorage or fallback to Mock Data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Parse stored data and ensure date strings are valid
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
    return generateMockTransactions();
  });

  // Persist to LocalStorage whenever transactions change
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

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'created_at'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setTransactions(prev => [transaction, ...prev]);
    setIsCmdOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to delete all data and reset to defaults?')) {
      const defaults = generateMockTransactions();
      setTransactions(defaults);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      setCurrentView('dashboard');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'history':
        return <History transactions={transactions} />;
      case 'settings':
        return <Settings onReset={handleResetData} />;
      default:
        return <Dashboard transactions={transactions} />;
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
    </>
  );
};

export default App;