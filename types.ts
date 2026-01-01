export type TransactionType = 'income' | 'expense';

export type View = 'dashboard' | 'history' | 'settings';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  created_at: string; // ISO string
}

export interface StatCardProps {
  label: string;
  value: string;
  trend?: number; // percentage
  trendLabel?: string;
  highlight?: boolean;
}

export interface AppState {
  isCmdOpen: boolean;
  view: View;
}