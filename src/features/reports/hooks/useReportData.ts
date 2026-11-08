import { dayOfMonth, daysInMonth } from '../../../base/utils/date';
import { percentage } from '../../../base/utils/money';
import useOverview from '../../home/hooks/useOverview';
import { getBookCategories, getCategoryColor } from '../../transactions/constants';
import type { Transaction } from '../../transactions/types';
type UseReportDataParams = { month: string; type: Transaction['type'] };
const useReportData = (params: UseReportDataParams) => {
  const { month, type } = params;
  const overview = useOverview(month);
  const label = type === 'expense' ? 'Tiền ra' : 'Tiền vào';
  const transactions = overview.transactions.filter((row) => row.type === type);
  const total = type === 'expense' ? overview.spent : overview.income;
  const breakdown = getBookCategories(overview.data).map((category) => {
    const amount = transactions
      .filter((row) => row.category === category)
      .reduce((sum, row) => sum + BigInt(row.amount), 0n);
    return {
      category,
      amount,
      share: percentage(amount, total),
      color: getCategoryColor(category),
    };
  });
  const pieData = breakdown.filter((row) => row.amount > 0n);
  const daily = Array.from({ length: daysInMonth(month) }, (_, index) => ({
    day: index + 1,
    value:
      Number(
        transactions
          .filter((row) => dayOfMonth(row.date) === index + 1)
          .reduce((sum, row) => sum + BigInt(row.amount), 0n),
      ) / 1000,
  }));

  return { overview, label, transactions, total, breakdown, pieData, daily };
};
export default useReportData;
