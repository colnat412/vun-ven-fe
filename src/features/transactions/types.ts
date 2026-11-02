export type Category = 'Ăn uống' | 'Di chuyển' | 'Mua sắm' | 'Hóa đơn' | 'Giải trí' | 'Khác';
export type Transaction = {
  id: string;
  amount: string;
  note: string;
  category: Category;
  wallet: string;
  /** ISO timestamp with offset; legacy records may contain YYYY-MM-DD only. */
  date: string;
  type: 'expense' | 'income';
};
export type TransactionInput = Omit<Transaction, 'id'> & { time: string };
export type Book = {
  version: 1;
  transactions: Transaction[];
  budgets: Record<string, string>;
  categoryBudgets?: Record<string, Partial<Record<Category, string>>>;
};
