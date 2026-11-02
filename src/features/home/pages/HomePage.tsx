import { formatLongDate, currentMonth } from '../../../shared/utils/date';
import AppIcon from '../../../shared/ui/AppIcon';
import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff, Plus, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button as UiButton } from '@/components/ui/button';
import Button from '../../../shared/ui/Button';
import IconButton from '../../../shared/ui/IconButton';
import Modal from '../../../shared/ui/Modal';
import PageState from '../../../shared/ui/PageState';
import { formatMoney } from '../../../shared/utils/money';
import TransactionForm from '../../transactions/components/TransactionForm';
import TransactionList from '../../transactions/components/TransactionList';
import { categoryColors } from '../../transactions/constants';
import useAmountVisibility from '../hooks/useAmountVisibility';
import useOverview from '../hooks/useOverview';

const HomePage = () => {
  const overview = useOverview();
  const { isHidden, toggleVisibility } = useAmountVisibility();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const date = formatLongDate();
  const money = (amount: bigint) => (isHidden ? '••••••' : formatMoney(amount));
  if (overview.isPending) return <PageState kind="loading" message="Đang mở sổ của bạn…" />;
  if (overview.error)
    return (
      <PageState
        kind="error"
        message={overview.error.message}
        onRetry={() => {
          void overview.refetch();
        }}
      />
    );
  return (
    <div className="home-grid">
      <div className="page-heading home-heading">
        <p className="eyebrow">{date}</p>
        <h1 className="date-heading">Chào buổi sáng</h1>
      </div>
      <div className="home-main stack-lg">
        <Card className="home-summary">
          <CardHeader className="row summary-heading mb-0 flex items-center">
            <CardTitle className="text-sm font-medium">
              Tiền ra tháng {Number(currentMonth().slice(5))}
            </CardTitle>
            <IconButton
              label={isHidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
              aria-pressed={isHidden}
              onClick={toggleVisibility}
            >
              {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </CardHeader>
          <CardContent>
            <p className="hero-amount">{money(overview.spent)}</p>
            <div className="summary-cashflow">
              <div>
                <span className="cashflow-label">
                  <ArrowDown size={18} /> Tiền vào
                </span>
                <strong>{money(overview.income)}</strong>
              </div>
              <div>
                <span className="cashflow-label">
                  <ArrowUp size={18} /> Tiền ra
                </span>
                <strong>{money(overview.spent)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="quick-actions">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={19} />
            Ghi thủ công
          </Button>
          <UiButton asChild variant="secondary" className="button button--secondary">
            <Link to="/reports">
              <AppIcon name="piggy-bank-budget" size={19} />
              Ngân sách
            </Link>
          </UiButton>
        </div>
        <div>
          <div className="section-heading">
            <h2>Gần đây</h2>
            <Link className="text-link" to="/transactions">
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>
          {overview.recent.length ? (
            <Card className="list-card">
              <CardContent>
                <TransactionList
                  transactions={overview.recent.slice(0, 5)}
                  hideAmounts={isHidden}
                />
              </CardContent>
            </Card>
          ) : (
            <PageState kind="empty" message="Chưa có giao dịch trong tháng này." />
          )}
        </div>
      </div>
      <aside className="home-aside stack-lg">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tiền đi đâu?</CardTitle>
            <Badge variant="secondary">Tháng này</Badge>
          </CardHeader>
          <CardContent>
            {overview.byCategory.length ? (
              <>
                <div className="category-strip">
                  {overview.byCategory.map((row) => (
                    <span
                      key={row.category}
                      style={{
                        flex: Number((row.amount * 1000n) / overview.spent) || 1,
                        background: categoryColors[row.category],
                      }}
                    />
                  ))}
                </div>
                <div className="stack">
                  {overview.byCategory.map((row) => (
                    <div className="row category-row" key={row.category}>
                      <span>
                        <i style={{ background: categoryColors[row.category] }} />
                        {row.category}
                      </span>
                      <strong>{money(row.amount)}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="muted">Biểu đồ sẽ xuất hiện khi bạn ghi tiền ra đầu tiên.</p>
            )}
          </CardContent>
        </Card>
        <p className="demo-note">
          Dữ liệu dùng thử trên trình duyệt.
          <br />
          Chưa kết nối tài khoản ngân hàng.
        </p>
      </aside>
      {isFormOpen && (
        <Modal title="Thêm giao dịch" onClose={() => setIsFormOpen(false)}>
          <TransactionForm onSaved={() => setIsFormOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
