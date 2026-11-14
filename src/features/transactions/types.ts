export type Category = string;
export type CategoryDefinition = {
  id: string;
  name: string;
  isActive: boolean;
  icon?: string | null;
};
export type WalletKind = 'cash' | 'bank' | 'ewallet';
export type WalletDefinition = {
  id: string;
  name: string;
  kind: WalletKind;
  isActive: boolean;
  icon?: string | null;
};
export type Transaction = {
  id: string;
  amount: string;
  note: string;
  category: Category;
  wallet: string;
  /** ISO timestamp with offset; legacy records may contain YYYY-MM-DD only. */
  date: string;
  type: 'expense' | 'income';
  hasPhoto?: boolean;
  createdAt?: string;
};
export type TransactionInput = Omit<Transaction, 'id'> & {
  time: string;
  photoDataUrl?: string;
  clientRequestId?: string;
};
export type Book = {
  version: 1;
  source?: 'server' | 'guest';
  categoryOptions?: Category[];
  categoryDefinitions?: CategoryDefinition[];
  walletOptions?: string[];
  walletDefinitions?: WalletDefinition[];
  transactions: Transaction[];
  budgets: Record<string, string>;
  categoryBudgets?: Record<string, Partial<Record<Category, string>>>;
};
