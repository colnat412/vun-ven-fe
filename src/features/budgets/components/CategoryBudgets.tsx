import { Fragment } from 'react';
import { Progress } from '@/components/ui/progress';
import { Pencil, Plus, CircleAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Item, ItemGroup, ItemTitle, ItemSeparator } from '@/components/ui/item';
import Button from '../../../shared/ui/Button';
import { formatMoney, percentage } from '../../../shared/utils/money';
import { categoryColors } from '../../transactions/constants';
import type { Category } from '../../transactions/types';
import type { getCategoryBudgets } from '../utils/categoryBudgets';

type CategoryBudgetsProps = {
  rows: ReturnType<typeof getCategoryBudgets>;
  totalBudget: bigint;
  onEdit: (category: Category, amount: string) => void;
};
const CategoryBudgets = ({ rows, totalBudget, onEdit }: CategoryBudgetsProps) => {
  const allocated = rows.reduce((total, row) => total + row.limit, 0n);
  const totalSpent = rows.reduce((total, row) => total + row.spent, 0n);
  return (
    <Card>
      <section className="stack" aria-labelledby="category-budgets-heading">
        <CardHeader className="mb-4 flex flex-row items-center justify-between">
          <CardTitle id="category-budgets-heading">Ngân sách theo danh mục</CardTitle>
          <Badge variant="secondary">{rows.length} danh mục</Badge>
        </CardHeader>
        <CardContent>
          <div className="small muted flex flex-wrap justify-between gap-1">
            <span>
              Đã phân bổ <strong className="text-foreground">{formatMoney(allocated)}</strong>
            </span>
            <span className={totalBudget > 0n && allocated > totalBudget ? 'text-destructive' : ''}>
              {totalBudget > 0n
                ? allocated > totalBudget
                  ? `Vượt tổng ngân sách ${formatMoney(allocated - totalBudget)}`
                  : `Chưa phân bổ ${formatMoney(totalBudget - allocated)}`
                : 'Chưa đặt tổng ngân sách'}
            </span>
          </div>
          <ItemGroup className="statistics-categories">
            {rows.map((row, index) => (
              <Fragment key={row.category}>
                {index > 0 && <ItemSeparator />}
                <Item
                  key={row.category}
                  role="listitem"
                  className="statistics-category block rounded-none border-0 px-0 py-4"
                  aria-label={`Ngân sách ${row.category}`}
                >
                  <div className="row">
                    <ItemTitle className="flex items-center gap-2 text-sm font-medium">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: categoryColors[row.category] }}
                      />
                      {row.category}
                    </ItemTitle>
                    <strong className="text-sm font-semibold">{formatMoney(row.spent)}</strong>
                  </div>
                  <Progress
                    value={percentage(row.spent, totalSpent)}
                    aria-label={`Tỷ trọng tiền ra ${row.category}`}
                    indicatorStyle={{ background: categoryColors[row.category] }}
                    className="mt-3 bg-muted"
                  />
                  <div className="row mt-2">
                    <div className="small muted">
                      <p>
                        {row.limit > 0n ? `Hạn mức ${formatMoney(row.limit)}` : 'Chưa đặt hạn mức'}{' '}
                        · {percentage(row.spent, totalSpent).toFixed(0)}% tiền ra
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
              </Fragment>
            ))}
          </ItemGroup>
        </CardContent>
      </section>
    </Card>
  );
};
export default CategoryBudgets;
