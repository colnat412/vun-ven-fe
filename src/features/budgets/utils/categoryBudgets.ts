import { monthKey } from '../../../base/utils/date';
import { percentage } from '../../../base/utils/money';
import { getBookCategories } from '../../transactions/constants';
import type { Book } from '../../transactions/types';

export const getCategoryBudgets = (book: Book, month: string) => {
  const expenses = book.transactions.filter(
    (row) => row.type === 'expense' && monthKey(row.date) === month,
  );
  return [
    ...new Set([...getBookCategories(book), ...Object.keys(book.categoryBudgets?.[month] ?? {})]),
  ].map((category) => {
    const limits = book.categoryBudgets?.[month];
    const hasLimit = !!limits && Object.hasOwn(limits, category);
    const limit = BigInt(
      limits && Object.hasOwn(limits, category) ? (limits[category] ?? '0') : '0',
    );
    const spent = expenses
      .filter((row) => row.category === category)
      .reduce((total, row) => total + BigInt(row.amount), 0n);
    return {
      category,
      categoryId: book.categoryDefinitions?.find((row) => row.name === category)?.id ?? category,
      isActive:
        book.categoryDefinitions?.some((row) => row.name === category && row.isActive) ?? true,
      hasLimit,
      limit,
      spent,
      remaining: limit - spent,
      usedPercent: percentage(spent, limit),
    };
  });
};
