import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ArrowDownLeft, Car, Coffee, Ellipsis, Receipt, ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import TransactionDialog from './TransactionDialog';
import TransactionPhoto from './TransactionPhoto';
import { formatDateTime, formatTime } from '../../../base/utils/date';
import { formatMoney } from '../../../base/utils/money';
import type { Category, Transaction } from '../types';

type TransactionListProps = {
  transactions: Transaction[];
  hideAmounts?: boolean;
  showDates?: boolean;
};
const icons = {
  'Ăn uống': Coffee,
  'Di chuyển': Car,
  'Mua sắm': ShoppingBag,
  'Hóa đơn': Receipt,
  'Giải trí': Sparkles,
  Khác: Ellipsis,
} satisfies Record<Category, typeof Coffee>;
const TransactionList = (props: TransactionListProps) => {
  const { transactions, hideAmounts = false, showDates = true } = props;
  const [editing, setEditing] = useState<Transaction>();
  return (
    <>
      <ItemGroup role="list" className="transaction-list">
        {transactions.map((transaction) => {
          const Icon =
            transaction.type === 'income'
              ? ArrowDownLeft
              : Object.hasOwn(icons, transaction.category)
                ? icons[transaction.category as keyof typeof icons]
                : Ellipsis;
          return (
            <Item
              key={transaction.id}
              role="listitem"
              className="transaction relative flex-nowrap gap-3 rounded-none px-0 py-4 [&+.transaction]:border-t-border"
            >
              <button
                type="button"
                className="absolute inset-0 z-10 cursor-pointer rounded-md hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                aria-label={`Mở giao dịch ${transaction.note || transaction.category}`}
                onClick={() => setEditing(transaction)}
              />
              <ItemMedia
                className={`transaction-icon bg-[var(--tint)] self-center group-has-[[data-slot=item-description]]/item:translate-y-0 group-has-[[data-slot=item-description]]/item:self-center ${transaction.type === 'income' ? 'transaction-icon--income' : ''}`}
              >
                {transaction.hasPhoto ? (
                  <TransactionPhoto id={transaction.id} thumbnail />
                ) : (
                  <Icon size={20} aria-hidden="true" />
                )}
              </ItemMedia>
              <ItemContent className="transaction-description min-w-0">
                <ItemTitle className="block w-full truncate text-sm font-medium">
                  {transaction.note || transaction.category}
                </ItemTitle>
                <ItemDescription className="block truncate text-xs">
                  {transaction.category} · {transaction.wallet}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="transaction-amount grid gap-1">
                <strong className={transaction.type === 'income' ? 'positive' : ''}>
                  {hideAmounts
                    ? '••••••'
                    : `${transaction.type === 'income' ? '+' : '−'}${formatMoney(transaction.amount)}`}
                </strong>
                <span>
                  <time dateTime={transaction.date}>
                    {showDates ? formatDateTime(transaction.date) : formatTime(transaction.date)}
                  </time>
                </span>
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
      <TransactionDialog
        open={!!editing}
        transaction={editing}
        onClose={() => setEditing(undefined)}
      />
    </>
  );
};
export default TransactionList;
