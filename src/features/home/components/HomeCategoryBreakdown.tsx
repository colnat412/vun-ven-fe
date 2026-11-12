import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { percentage } from '../../../base/utils/money';
import CategoryJarGrid from '../../transactions/components/CategoryJarGrid';
import type { Category } from '../../transactions/types';
import { currentMonth } from '../../../base/utils/date';

type HomeCategoryBreakdownProps = {
  rows: {
    category: Category;
    amount: bigint;
  }[];
  spent: bigint;
  isHidden: boolean;
  month?: string;
};
const HomeCategoryBreakdown = (props: HomeCategoryBreakdownProps) => {
  const { rows, spent, isHidden, month = currentMonth() } = props;
  return (
    <aside className="home-aside stack-lg">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tiền đi đâu?</CardTitle>
          <Badge variant="secondary">
            Tháng {Number(month.slice(5))}/{month.slice(0, 4)}
          </Badge>
        </CardHeader>
        <CardContent>
          {rows.length ? (
            <CategoryJarGrid
              rows={rows.map((row) => ({ ...row, share: percentage(row.amount, spent) }))}
              label="tổng chi"
              hideAmounts={isHidden}
            />
          ) : (
            <p className="muted">Các hũ sẽ xuất hiện khi bạn ghi tiền ra đầu tiên.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
export default HomeCategoryBreakdown;
