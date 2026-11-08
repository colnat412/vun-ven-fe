import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pencil } from 'lucide-react';
import AppIcon from '../../../base/ui/AppIcon';
import Button from '../../../base/ui/Button';
import { remainingDaysInMonth } from '../../../base/utils/date';
import { formatMoney } from '../../../base/utils/money';

type BudgetSummaryProps = {
  month: string;
  budget: bigint;
  spent: bigint;
  usedPercent: number;
  onEdit: () => void;
};
const BudgetSummary = (props: BudgetSummaryProps) => {
  const { month, budget, spent, usedPercent, onEdit } = props;
  const remaining = budget - spent;
  const remainingDays = remainingDaysInMonth(month);
  const perDay = remainingDays > 0 && remaining > 0n ? remaining / BigInt(remainingDays) : 0n;
  return (
    <Card className="statistics-budget">
      <CardHeader className="row mb-0 flex items-center">
        <CardTitle className="flex items-center gap-2">
          <AppIcon name="piggy-bank-budget" size={19} />
          Ngân sách tháng
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            className="min-h-9 p-2"
            aria-label="Điều chỉnh ngân sách"
            onClick={onEdit}
          >
            <Pencil size={16} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="hero-amount">{formatMoney(budget)}</p>
        <Progress value={Math.min(100, usedPercent)} aria-label="Ngân sách đã dùng" />
        <div className="row mt-3 small muted">
          <span>Đã dùng {usedPercent.toFixed(0)}%</span>
          <span className={remaining < 0n ? 'text-destructive' : ''}>
            {budget === 0n
              ? 'Chưa đặt ngân sách'
              : remaining < 0n
                ? `Vượt ${formatMoney(-remaining)}`
                : `Còn ${formatMoney(remaining)}`}
          </span>
        </div>
        {budget > 0n && remainingDays > 0 && (
          <p className="mt-3 small muted">
            Có thể dùng mỗi ngày <strong className="text-foreground">{formatMoney(perDay)}</strong>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
export default BudgetSummary;
