import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import IconButton from '../../../base/ui/IconButton';
import { currentMonth } from '../../../base/utils/date';
import { formatMoney } from '../../../base/utils/money';
import otterSummary from '@/assets/mascots/otter-summary.webp';

type HomeSummaryProps = {
  month?: string;
  spent: bigint;
  income: bigint;
  isHidden: boolean;
  onToggleVisibility: () => void;
};
const HomeSummary = (props: HomeSummaryProps) => {
  const { spent, income, isHidden, onToggleVisibility, month = currentMonth() } = props;
  const money = (amount: bigint) => (isHidden ? '••••••' : formatMoney(amount));
  return (
    <div className="summary-shell">
      <img
        src={otterSummary}
        alt=""
        aria-hidden="true"
        className="summary-mascot"
        width={512}
        height={410}
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
      <Card className="home-summary">
        <IconButton
          className="summary-visibility"
          label={isHidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
          aria-pressed={isHidden}
          onClick={onToggleVisibility}
        >
          {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
        <div className="summary-hero">
          <div className="min-w-0">
            <CardHeader className="summary-heading mb-0">
              <CardTitle className="text-sm font-medium">
                Tiền ra tháng {Number(month.slice(5))}/{month.slice(0, 4)}
              </CardTitle>
            </CardHeader>
            <p className="hero-amount">{money(spent)}</p>
          </div>
        </div>
        <CardContent>
          <div className="summary-cashflow">
            <div>
              <span className="cashflow-label">
                <ArrowDownLeft size={18} aria-hidden="true" /> Tiền vào
              </span>
              <strong>{money(income)}</strong>
            </div>
            <div>
              <span className="cashflow-label">
                <ArrowUpRight size={18} aria-hidden="true" /> Tiền ra
              </span>
              <strong>{money(spent)}</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default HomeSummary;
