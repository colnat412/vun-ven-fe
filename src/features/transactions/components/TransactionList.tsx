import Button from '@/base/ui/Button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ArrowDownLeft } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import PaymentMethodIcon from '../../wallets/components/PaymentMethodIcon';
import { useLocation, useNavigate } from 'react-router';
import TransactionPhoto from './TransactionPhoto';
import { formatDateTime, formatTime } from '../../../base/utils/date';
import { formatMoney } from '../../../base/utils/money';
import type { Transaction } from '../types';

type TransactionListProps = {
  transactions: Transaction[];
  hideAmounts?: boolean;
  showDates?: boolean;
};
const TransactionList = (props: TransactionListProps) => {
  const { transactions, hideAmounts = false, showDates = true } = props;
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <ItemGroup role="list" className="transaction-list">
        {transactions.map((transaction) => {
          return (
            <Item
              key={transaction.id}
              role="listitem"
              className="transaction relative flex-nowrap gap-3 rounded-none px-0 py-4 [&+.transaction]:border-t-border"
            >
              <Button
                variant="unstyled"
                type="button"
                className="absolute inset-0 z-10 cursor-pointer rounded-md hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                aria-label={`Mở giao dịch ${transaction.note || transaction.category}`}
                onClick={() =>
                  navigate(`/transactions/${encodeURIComponent(transaction.id)}/edit`, {
                    state: { returnTo: location.pathname + location.search },
                  })
                }
              />
              <ItemMedia
                className={`transaction-icon relative overflow-visible bg-[var(--tint)] self-center group-has-[[data-slot=item-description]]/item:translate-y-0 group-has-[[data-slot=item-description]]/item:self-center ${transaction.type === 'income' ? 'transaction-icon--income' : ''}`}
              >
                {transaction.hasPhoto ? (
                  <TransactionPhoto id={transaction.id} thumbnail />
                ) : transaction.type === 'income' ? (
                  <ArrowDownLeft size={20} aria-hidden="true" />
                ) : (
                  <CategoryIcon category={transaction.category} size={20} />
                )}
                <span
                  role="img"
                  aria-label={`Phương thức thanh toán: ${transaction.wallet}`}
                  title={transaction.wallet}
                  className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center overflow-hidden rounded-md bg-card ring-2 ring-card"
                >
                  <PaymentMethodIcon name={transaction.wallet} size={18} />
                </span>
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
    </>
  );
};
export default TransactionList;
