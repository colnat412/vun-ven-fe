import { monthKey } from '../../../shared/utils/date';
import { categories } from '../../transactions/constants';
import type { Book } from '../../transactions/types';
import { percentage } from '../../../shared/utils/money';

export const getCategoryBudgets = (book: Book, month: string) => {
  const expenses = book.transactions.filter(
    (row) => row.type === 'expense' && monthKey(row.date) === month,
  );
  return categories.map((category) => {
    const limit = BigInt(book.categoryBudgets?.[month]?.[category] ?? '0');
    const spent = expenses
      .filter((row) => row.category === category)
      .reduce((total, row) => total + BigInt(row.amount), 0n);
    return {
      category,
      limit,
      spent,
      remaining: limit - spent,
      usedPercent: percentage(spent, limit),
    };
  });
};
