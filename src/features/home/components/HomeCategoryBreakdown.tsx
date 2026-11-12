import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '../../../base/utils/money';
import { getCategoryColor } from '../../transactions/constants';
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
  const money = (amount: bigint) => (isHidden ? '••••••' : formatMoney(amount));
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
            <>
              <div className="category-strip">
                {rows.map((row) => (
                  <span
                    key={row.category}
                    style={{
                      flex: Number((row.amount * 1000n) / spent) || 1,
                      background: getCategoryColor(row.category),
                    }}
                  />
                ))}
              </div>
              <div className="stack">
                {rows.map((row) => (
                  <div className="row category-row" key={row.category}>
                    <span className="min-w-0 truncate" title={row.category}>
                      <i style={{ background: getCategoryColor(row.category) }} />
                      {row.category}
                    </span>
                    <strong className="shrink-0">{money(row.amount)}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">Biểu đồ sẽ xuất hiện khi bạn ghi tiền ra đầu tiên.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
export default HomeCategoryBreakdown;
