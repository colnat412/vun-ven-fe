import { useState } from 'react';
import PageState from '../../../base/ui/PageState';
import { formatLongDate } from '../../../base/utils/date';
import TransactionDialog from '../../transactions/components/TransactionDialog';
import HomeCategoryBreakdown from '../components/HomeCategoryBreakdown';
import HomeQuickActions from '../components/HomeQuickActions';
import HomeSummary from '../components/HomeSummary';
import RecentTransactions from '../components/RecentTransactions';
import useAmountVisibility from '../hooks/useAmountVisibility';
import useOverview from '../hooks/useOverview';

const HomePage = () => {
  const overview = useOverview();
  const { isHidden, toggleVisibility } = useAmountVisibility();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const date = formatLongDate();
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
        <HomeSummary
          spent={overview.spent}
          income={overview.income}
          isHidden={isHidden}
          onToggleVisibility={toggleVisibility}
        />
        <HomeQuickActions onCreate={() => setIsFormOpen(true)} />
        <RecentTransactions transactions={overview.recent} hideAmounts={isHidden} />
      </div>
      <HomeCategoryBreakdown
        rows={overview.byCategory}
        spent={overview.spent}
        isHidden={isHidden}
      />
      <TransactionDialog
        open={isFormOpen}
        title="Thêm giao dịch"
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};
export default HomePage;
