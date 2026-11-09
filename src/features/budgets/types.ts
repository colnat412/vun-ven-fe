export type BudgetCategory = {
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  limitVnd: string | null;
  spentVnd: string;
};

export type MonthBudget = {
  month: string;
  totalLimitVnd: string | null;
  spentVnd: string;
  categories: BudgetCategory[];
};

export type BudgetInput = {
  month: string;
  amount: string | null;
  category?: string;
  categoryId?: string;
};
