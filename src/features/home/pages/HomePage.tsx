import { useState } from 'react';
import PageState from '../../../base/ui/PageState';
import { currentMonth } from '../../../base/utils/date';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionCalendar from '../../transactions/components/TransactionCalendar';
import TransactionDialog from '../../transactions/components/TransactionDialog';
import HomeCategoryBreakdown from '../components/HomeCategoryBreakdown';
import HomeQuickActions from '../components/HomeQuickActions';
import HomeSummary from '../components/HomeSummary';
import RecentTransactions from '../components/RecentTransactions';
import useAmountVisibility from '../hooks/useAmountVisibility';
import useOverview from '../hooks/useOverview';

const HomePage = () => {
  const [month, setMonth] = useState(currentMonth);
  const overview = useOverview(month);
  const { isHidden, toggleVisibility } = useAmountVisibility();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [view, setView] = useState('calendar');
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
      <h1 className="sr-only">Trang chủ</h1>
      <div className="home-main stack-lg">
        <HomeSummary
          month={month}
          spent={overview.spent}
          income={overview.income}
          isHidden={isHidden}
          onToggleVisibility={toggleVisibility}
        />
        <HomeQuickActions
          onManual={() => {
            setIsManualOpen(true);
          }}
        />
        <Tabs value={view} onValueChange={setView} className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2>Nhật ký thu chi</h2>
            <TabsList aria-label="Cách xem nhật ký">
              <TabsTrigger value="calendar">Lịch</TabsTrigger>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="calendar">
            <TransactionCalendar
              key={month}
              month={month}
              onMonthChange={setMonth}
              transactions={overview.transactions}
              hideAmounts={isHidden}
            />
          </TabsContent>
          <TabsContent value="list">
            <RecentTransactions transactions={overview.recent} hideAmounts={isHidden} />
          </TabsContent>
        </Tabs>
      </div>
      <HomeCategoryBreakdown
        month={month}
        rows={overview.byCategory}
        spent={overview.spent}
        isHidden={isHidden}
      />
      <TransactionDialog open={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};
export default HomePage;
