import { Transaction } from '../types';

export const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: '1',
      amount: 4500.00,
      description: 'Retainer: Acme Corp',
      category: 'Einkommen',
      type: 'income',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      amount: 29.00,
      description: 'Framer Abo',
      category: 'Software',
      type: 'expense',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      amount: 150.00,
      description: 'Design Assets',
      category: 'Material',
      type: 'expense',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
     {
      id: '4',
      amount: 3200.00,
      description: 'Gehaltseingang',
      category: 'Einkommen',
      type: 'income',
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '5',
      amount: 4.50,
      description: 'Cappuccino & Croissant',
      category: 'Essen',
      type: 'expense',
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: '6',
      amount: 1200.00,
      description: 'Miete Studio',
      category: 'Wohnen',
      type: 'expense',
      created_at: new Date(Date.now() - 400000000).toISOString(), // older
    }
  ];
};