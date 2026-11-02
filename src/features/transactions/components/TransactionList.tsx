import { Coffee, ShoppingBag, Car, Receipt, Ellipsis, Sparkles, ArrowDownLeft } from 'lucide-react';
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import { formatMoney } from '../../../shared/utils/money';
import { formatDateTime, formatTime } from '../../../shared/utils/date';
import type { Transaction, Category } from '../types';

const icons = {
  'Ăn uống': Coffee,
  'Di chuyển': Car,
  'Mua sắm': ShoppingBag,
  'Hóa đơn': Receipt,
  'Giải trí': Sparkles,
  Khác: Ellipsis,
} satisfies Record<Category, typeof Coffee>;
const TransactionList = ({
  transactions,
  hideAmounts = false,
  showDates = true,
}: {
  transactions: Transaction[];
  hideAmounts?: boolean;
  showDates?: boolean;
}) => (
  <ItemGroup role="list" className="transaction-list">
    {transactions.map((transaction) => {
      const Icon = transaction.type === 'income' ? ArrowDownLeft : icons[transaction.category];
      return (
        <Item
          key={transaction.id}
          role="listitem"
          className="transaction flex-nowrap gap-3 rounded-none px-0 py-4 [&+.transaction]:border-t-border"
        >
          <ItemMedia
            className={`transaction-icon bg-[var(--tint)] self-center group-has-[[data-slot=item-description]]/item:translate-y-0 group-has-[[data-slot=item-description]]/item:self-center ${transaction.type === 'income' ? 'transaction-icon--income' : ''}`}
          >
            <Icon size={20} aria-hidden="true" />
          </ItemMedia>
          <ItemContent className="transaction-description min-w-0">
            <ItemTitle className="block w-full truncate text-sm font-medium">
              {transaction.note || transaction.category}
            </ItemTitle>
            <ItemDescription className="text-xs">
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
);
export default TransactionList;
