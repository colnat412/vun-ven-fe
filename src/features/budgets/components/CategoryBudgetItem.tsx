import { Item, ItemTitle } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { CircleAlert, Pencil, Plus } from 'lucide-react';
import Button from '../../../base/ui/Button';
import { formatMoney, percentage } from '../../../base/utils/money';
import { getCategoryColor } from '../../transactions/constants';
import type { Category } from '../../transactions/types';
import type { getCategoryBudgets } from '../utils/categoryBudgets';

type CategoryBudgetItemProps = {
  row: ReturnType<typeof getCategoryBudgets>[number];
  totalSpent: bigint;
  onEdit: (category: Category, amount: string) => void;
};
const CategoryBudgetItem = (props: CategoryBudgetItemProps) => {
  const { row, totalSpent, onEdit } = props;
  return (
    <Item
      key={row.category}
      role="listitem"
      className="statistics-category block rounded-none border-0 px-0 py-4"
      aria-label={`Ngân sách ${row.category}`}
    >
      <div className="row">
        <ItemTitle className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: getCategoryColor(row.category) }}
          />
          <span className="truncate" title={row.category}>
            {row.category}
          </span>
        </ItemTitle>
        <strong className="shrink-0 text-sm font-semibold">{formatMoney(row.spent)}</strong>
      </div>
      <Progress
        value={percentage(row.spent, totalSpent)}
        aria-label={`Tỷ trọng tiền ra ${row.category}`}
        indicatorStyle={{ background: getCategoryColor(row.category) }}
        className="mt-3 bg-muted"
      />
      <div className="row mt-2">
        <div className="small muted">
          <p>
            {row.limit > 0n ? `Hạn mức ${formatMoney(row.limit)}` : 'Chưa đặt hạn mức'} ·{' '}
            {percentage(row.spent, totalSpent).toFixed(0)}% tiền ra
          </p>
          {row.limit > 0n && (
            <p className={row.remaining < 0n ? 'text-destructive' : ''}>
              {row.remaining < 0n && (
                <CircleAlert size={12} className="mr-1 inline" aria-hidden="true" />
              )}
              {row.remaining < 0n
                ? `Vượt ${formatMoney(-row.remaining)}`
                : `Còn ${formatMoney(row.remaining)}`}{' '}
              · Đã dùng {row.usedPercent.toFixed(0)}% hạn mức
            </p>
          )}
          {row.limit === 0n && <p>Chưa giới hạn</p>}
        </div>
        <Button
          variant="ghost"
          className="min-h-10 shrink-0 p-2"
          aria-label={`${row.limit > 0n ? 'Sửa' : 'Đặt'} hạn mức ${row.category}`}
          onClick={() => onEdit(row.category, row.limit.toString())}
        >
          {row.limit > 0n ? <Pencil size={16} /> : <Plus size={16} />}
        </Button>
      </div>
    </Item>
  );
};
export default CategoryBudgetItem;
