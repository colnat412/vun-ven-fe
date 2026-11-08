import {
  compareDateTimeDescending,
  currentMonth,
  dateKey,
  monthKey,
  today,
} from '../../../base/utils/date';
import { percentage, sumMoney } from '../../../base/utils/money';
import { getBookCategories } from '../../transactions/constants';
import { useBook } from '../../transactions/hooks/useBook';

const useOverview = (month = currentMonth()) => {
  const query = useBook();
  const transactions = query.data?.transactions.filter((row) => monthKey(row.date) === month) ?? [];
  const expenses = transactions.filter((row) => row.type === 'expense');
  const spent = sumMoney(expenses.map((row) => row.amount));
  const income = sumMoney(
    transactions.filter((row) => row.type === 'income').map((row) => row.amount),
  );
  const budget = BigInt(query.data?.budgets[month] ?? '0');
  const todaySpent = sumMoney(
    expenses.filter((row) => dateKey(row.date) === today()).map((row) => row.amount),
  );
  const byCategory = getBookCategories(query.data)
    .map((category) => ({
      category,
      amount: sumMoney(
        expenses.filter((row) => row.category === category).map((row) => row.amount),
      ),
    }))
    .filter((row) => row.amount > 0n)
    .sort((a, b) => (a.amount === b.amount ? 0 : a.amount > b.amount ? -1 : 1));
  const recent = [...transactions].sort((a, b) => compareDateTimeDescending(a.date, b.date));
  return {
    data: query.data,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
    transactions,
    recent,
    byCategory,
    spent,
    income,
    budget,
    todaySpent,
    remaining: budget - spent,
    usedPercent: percentage(spent, budget),
  };
};

export default useOverview;
