import { compareDateTimeDescending, dateKey, daysInMonth } from '../../../base/utils/date';
import type { Transaction } from '../types';

export function monthCells(month: string): Array<string | null> {
  const first = new Date(`${month}-01T12:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const count = daysInMonth(month);
  return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day > 0 && day <= count ? `${month}-${String(day).padStart(2, '0')}` : null;
  });
}

type CalendarDay = {
  expense: bigint;
  income: bigint;
  transactions: Transaction[];
  photo?: Transaction;
};

export function calendarDays(transactions: Transaction[], month: string) {
  const days = new Map<string, CalendarDay>();
  for (const row of [...transactions].sort((a, b) => compareDateTimeDescending(a.date, b.date))) {
    const date = dateKey(row.date);
    if (!date.startsWith(month + '-')) continue;
    const day: CalendarDay = days.get(date) ?? { expense: 0n, income: 0n, transactions: [] };
    day[row.type] += BigInt(row.amount);
    day.transactions.push(row);
    if (row.hasPhoto && !day.photo) day.photo = row;
    days.set(date, day);
  }
  return days;
}

export function adjacentMonth(month: string, delta: number): string {
  const [year, number] = month.split('-').map(Number);
  const next = new Date(Date.UTC(year, number - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function compactCalendarMoney(amount: bigint): string {
  for (const [unit, divisor] of [
    ['tỷ', 1_000_000_000n],
    ['tr', 1_000_000n],
    ['k', 1_000n],
  ] as const) {
    if (amount >= divisor) {
      const tenths = (amount * 10n) / divisor;
      return `${tenths / 10n}${tenths % 10n ? ',' + (tenths % 10n) : ''}${unit}`;
    }
  }
  return amount.toString();
}
