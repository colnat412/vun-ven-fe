import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import { Fragment } from 'react';
import { formatMoney } from '../../../base/utils/money';
import type { Category } from '../../transactions/types';
import type { getCategoryBudgets } from '../utils/categoryBudgets';
import CategoryBudgetItem from './CategoryBudgetItem';

type CategoryBudgetsProps = {
  rows: ReturnType<typeof getCategoryBudgets>;
  totalBudget: bigint;
  onEdit: (category: Category, amount: string) => void;
};
const CategoryBudgets = (props: CategoryBudgetsProps) => {
  const { rows, totalBudget, onEdit } = props;
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
                <CategoryBudgetItem row={row} totalSpent={totalSpent} onEdit={onEdit} />
              </Fragment>
            ))}
          </ItemGroup>
        </CardContent>
      </section>
    </Card>
  );
};
export default CategoryBudgets;
