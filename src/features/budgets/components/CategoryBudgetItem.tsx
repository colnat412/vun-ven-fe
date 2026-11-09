import { Item, ItemTitle } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { CircleAlert, Pencil, Plus } from 'lucide-react';
import Button from '../../../base/ui/Button';
import { formatMoney, percentage } from '../../../base/utils/money';
import { getCategoryColor } from '../../transactions/constants';
import type { getCategoryBudgets } from '../utils/categoryBudgets';

type CategoryBudgetItemProps = {
  row: ReturnType<typeof getCategoryBudgets>[number];
  totalSpent: bigint;
  onEdit: (row: ReturnType<typeof getCategoryBudgets>[number]) => void;
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
        value={
          row.hasLimit
            ? row.limit === 0n && row.spent > 0n
              ? 100
              : Math.min(100, row.usedPercent)
            : 0
        }
        aria-label={`Tiến độ ngân sách ${row.category}`}
        indicatorStyle={{ background: getCategoryColor(row.category) }}
        className="mt-3 bg-muted"
      />
      <div className="row mt-2">
        <div className="small muted">
          <p>
            {row.hasLimit ? `Hạn mức ${formatMoney(row.limit)}` : 'Chưa đặt hạn mức'} ·{' '}
            {percentage(row.spent, totalSpent).toFixed(0)}% tiền ra
          </p>
          {row.hasLimit && (
            <p className={row.remaining < 0n || row.usedPercent >= 80 ? 'text-destructive' : ''}>
              {(row.remaining < 0n || row.usedPercent >= 80) && (
                <CircleAlert size={12} className="mr-1 inline" aria-hidden="true" />
              )}
              {row.remaining < 0n
                ? `Vượt ${formatMoney(-row.remaining)}`
                : `Còn ${formatMoney(row.remaining)}`}{' '}
              {row.limit > 0n && `· Đã dùng ${row.usedPercent.toFixed(0)}% hạn mức`}
            </p>
          )}
          {!row.hasLimit && <p>Chưa giới hạn</p>}
          {!row.isActive && <p>Danh mục đã ngừng sử dụng</p>}
        </div>
        <Button
          variant="ghost"
          className="min-h-10 shrink-0 p-2"
          aria-label={`${row.hasLimit ? 'Sửa' : 'Đặt'} hạn mức ${row.category}`}
          disabled={!row.isActive && !row.hasLimit}
          onClick={() => onEdit(row)}
        >
          {row.hasLimit ? <Pencil size={16} /> : <Plus size={16} />}
        </Button>
      </div>
    </Item>
  );
};
export default CategoryBudgetItem;
