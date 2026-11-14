import { useLocation, useNavigate, useSearchParams } from 'react-router';
import PageState from '../../../base/ui/PageState';
import { currentMonth } from '../../../base/utils/date';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionCalendar from '../../transactions/components/TransactionCalendar';
import HomeCategoryBreakdown from '../components/HomeCategoryBreakdown';
import HomeQuickActions from '../components/HomeQuickActions';
import HomeSummary from '../components/HomeSummary';
import RecentTransactions from '../components/RecentTransactions';
import useAmountVisibility from '../hooks/useAmountVisibility';
import useOverview from '../hooks/useOverview';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const savedMonth: unknown = params.get('month') ?? location.state?.journalMonth;
  const month =
    typeof savedMonth === 'string' && /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(savedMonth)
      ? savedMonth
      : currentMonth();
  const setMonth = (value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set('month', value);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  const overview = useOverview(month);
  const { isHidden, toggleVisibility } = useAmountVisibility();
  const view = params.get('view') === 'list' ? 'list' : 'calendar';
  const setView = (value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value === 'list') next.set('view', value);
        else next.delete('view');
        next.set('month', month);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
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
    <div className="stack-lg">
      <h1 className="sr-only">Trang chủ</h1>
      <div className="stack-lg">
        <HomeSummary
          month={month}
          spent={overview.spent}
          income={overview.income}
          isHidden={isHidden}
          onToggleVisibility={toggleVisibility}
        />
        <HomeQuickActions
          onManual={() => {
            navigate('/transactions/new', {
              state: { returnTo: location.pathname + location.search },
            });
          }}
        />
      </div>
      <Tabs
        value={view}
        onValueChange={setView}
        className="home-grid grid gap-[var(--space-section)]"
      >
        <div className="home-journal-heading flex flex-wrap items-center justify-between gap-3">
          <h2>Nhật ký thu chi</h2>
          <TabsList aria-label="Cách xem nhật ký">
            <TabsTrigger value="calendar">Lịch</TabsTrigger>
            <TabsTrigger value="list">Danh sách</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="calendar" className="home-main">
          <TransactionCalendar
            key={month}
            month={month}
            onMonthChange={setMonth}
            transactions={overview.transactions}
            hideAmounts={isHidden}
          />
        </TabsContent>
        <TabsContent value="list" className="home-main">
          <RecentTransactions transactions={overview.recent} hideAmounts={isHidden} />
        </TabsContent>
        <HomeCategoryBreakdown
          month={month}
          rows={overview.byCategory}
          spent={overview.spent}
          isHidden={isHidden}
        />
      </Tabs>
    </div>
  );
};
export default HomePage;
