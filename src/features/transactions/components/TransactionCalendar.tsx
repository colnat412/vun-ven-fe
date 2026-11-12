import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MonthPicker from '@/base/ui/MonthPicker';
import { formatDate, today } from '@/base/utils/date';
import { formatMoney } from '@/base/utils/money';
import { cn } from '@/lib/utils';
import type { Transaction } from '../types';
import {
  adjacentMonth,
  calendarDays,
  compactCalendarMoney,
  monthCells,
} from '../utils/transactionCalendar';
import TransactionPhoto from './TransactionPhoto';

type Props = {
  month: string;
  onMonthChange: (month: string) => void;
  transactions: Transaction[];
  hideAmounts?: boolean;
};

const TransactionCalendar = ({
  month,
  onMonthChange,
  transactions,
  hideAmounts = false,
}: Props) => {
  const days = calendarDays(transactions, month);
  const todayKey = today();
  const money = (amount: bigint) => (hideAmounts ? '•••' : compactCalendarMoney(amount));

  return (
    <Card className="max-[640px]:p-3">
      <CardContent className="grid min-w-0 gap-5">
        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-border hover:bg-accent"
            aria-label="Tháng trước"
            disabled={month <= '2000-01'}
            onClick={() => onMonthChange(adjacentMonth(month, -1))}
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <div className="min-w-0 [&_button]:px-2 [&_button]:text-xs">
            <MonthPicker
              label="Tháng nhật ký"
              hideLabel
              value={month}
              onValueChange={onMonthChange}
            />
          </div>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-border hover:bg-accent"
            aria-label="Tháng sau"
            disabled={month >= '2100-12'}
            onClick={() => onMonthChange(adjacentMonth(month, 1))}
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1" role="group" aria-label="Lịch thu chi theo ngày">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <span
              key={day}
              className="pb-2 text-center text-xs text-muted-foreground"
              aria-hidden="true"
            >
              {day}
            </span>
          ))}
          {monthCells(month).map((date, index) => {
            if (!date) return <span key={`empty-${index}`} aria-hidden="true" />;
            const day = days.get(date);
            const isToday = date === todayKey;
            const description = day
              ? `${day.transactions.length} giao dịch${hideAmounts ? '' : `, chi ${formatMoney(day.expense)}, thu ${formatMoney(day.income)}`}`
              : 'Chưa có giao dịch';
            return (
              <div
                key={date}
                role="group"
                aria-label={`${formatDate(date)}: ${description}`}
                aria-current={isToday ? 'date' : undefined}
                className={cn(
                  'relative aspect-square w-full min-h-0 min-w-0 overflow-hidden rounded-lg border border-border bg-muted/30 p-0 text-xs',
                  isToday && 'border-primary bg-primary/10 ring-2 ring-primary ring-inset',
                )}
              >
                {day?.photo && !hideAmounts && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center text-primary"
                  >
                    <TransactionPhoto
                      id={day.photo.id}
                      thumbnail
                      className="absolute inset-0 size-full rounded-none object-cover"
                    />
                    <span className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/90" />
                  </div>
                )}
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 flex size-3 items-center justify-center rounded-full text-[9px] font-semibold min-[360px]:top-1 min-[360px]:left-1 min-[360px]:size-4 min-[640px]:text-xs',
                    isToday && 'bg-primary text-primary-foreground',
                  )}
                >
                  {Number(date.slice(8))}
                </span>
                <span
                  className="absolute right-0.5 bottom-0.5 left-0.5 grid gap-px text-center text-[7px] leading-none font-semibold tabular-nums min-[360px]:bottom-1 min-[360px]:text-[9px] min-[640px]:text-xs"
                  aria-hidden="true"
                >
                  {!!day?.expense && <span className="truncate">−{money(day.expense)}</span>}
                  {!!day?.income && (
                    <span className="truncate text-[var(--positive)]">+{money(day.income)}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
export default TransactionCalendar;
