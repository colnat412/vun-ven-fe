import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react';
import IconButton from '../../../base/ui/IconButton';
import { currentMonth } from '../../../base/utils/date';
import { formatMoney } from '../../../base/utils/money';

type HomeSummaryProps = {
  spent: bigint;
  income: bigint;
  isHidden: boolean;
  onToggleVisibility: () => void;
};
const HomeSummary = (props: HomeSummaryProps) => {
  const { spent, income, isHidden, onToggleVisibility } = props;
  const money = (amount: bigint) => (isHidden ? '••••••' : formatMoney(amount));
  return (
    <Card className="home-summary">
      <CardHeader className="row summary-heading mb-0 flex items-center">
        <CardTitle className="text-sm font-medium">
          Tiền ra tháng {Number(currentMonth().slice(5))}
        </CardTitle>
        <IconButton
          label={isHidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
          aria-pressed={isHidden}
          onClick={onToggleVisibility}
        >
          {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
      </CardHeader>
      <CardContent>
        <p className="hero-amount">{money(spent)}</p>
        <div className="summary-cashflow">
          <div>
            <span className="cashflow-label">
              <ArrowDown size={18} /> Tiền vào
            </span>
            <strong>{money(income)}</strong>
          </div>
          <div>
            <span className="cashflow-label">
              <ArrowUp size={18} /> Tiền ra
            </span>
            <strong>{money(spent)}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default HomeSummary;
