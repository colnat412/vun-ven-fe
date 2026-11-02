import { Card, CardContent } from '@/components/ui/card';
import { today, dateKey, formatDate, compareDateTimeDescending } from '../../../shared/utils/date';
import type { Transaction } from '../types';
import TransactionList from './TransactionList';

const GroupedTransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  const groups = new Map<string, Transaction[]>();
  for (const transaction of [...transactions].sort((a, b) =>
    compareDateTimeDescending(a.date, b.date),
  )) {
    const key = dateKey(transaction.date);
    const group = groups.get(key) ?? [];
    group.push(transaction);
    groups.set(key, group);
  }
  return (
    <div className="stack-lg">
      {[...groups]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, rows]) => (
          <section key={date} data-date={date} aria-label={`Giao dịch ngày ${formatDate(date)}`}>
            <h2 className="mb-3 flex items-center justify-between gap-3 px-1 text-sm">
              <time dateTime={date}>
                {date === today() ? 'Hôm nay · ' : ''}
                {formatDate(date)}
              </time>
              <span className="text-xs font-normal text-muted-foreground">
                {rows.length} giao dịch
              </span>
            </h2>
            <Card className="list-card">
              <CardContent>
                <TransactionList transactions={rows} showDates={false} />
              </CardContent>
            </Card>
          </section>
        ))}
    </div>
  );
};

export default GroupedTransactionList;
