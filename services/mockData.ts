import { Transaction } from '../types';

export const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: '1',
      amount: 4500.00,
      description: 'Client Retainer: Acme Corp',
      category: 'Income',
      type: 'income',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      amount: 29.00,
      description: 'Framer Subscription',
      category: 'Software',
      type: 'expense',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      amount: 150.00,
      description: 'Design Assets',
      category: 'Assets',
      type: 'expense',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
     {
      id: '4',
      amount: 3200.00,
      description: 'Salary Deposit',
      category: 'Income',
      type: 'income',
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '5',
      amount: 45.00,
      description: 'Coffee & Bagel',
      category: 'Food',
      type: 'expense',
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: '6',
      amount: 1200.00,
      description: 'Rent Payment',
      category: 'Housing',
      type: 'expense',
      created_at: new Date(Date.now() - 400000000).toISOString(), // older
    }
  ];
};