import { useState } from 'react';
import PageState from '../../../base/ui/PageState';
import { formatLongDate } from '../../../base/utils/date';
import QuickTransactionDialog from '../../quick-transactions/components/QuickTransactionDialog';
import HomeCategoryBreakdown from '../components/HomeCategoryBreakdown';
import HomeQuickActions from '../components/HomeQuickActions';
import HomeSummary from '../components/HomeSummary';
import RecentTransactions from '../components/RecentTransactions';
import useAmountVisibility from '../hooks/useAmountVisibility';
import useOverview from '../hooks/useOverview';

const HomePage = () => {
  const overview = useOverview();
  const { isHidden, toggleVisibility } = useAmountVisibility();
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [notice, setNotice] = useState('');
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
        <HomeQuickActions
          onCreate={() => {
            setNotice('');
            setIsQuickOpen(true);
          }}
        />
        {notice && (
          <p role="status" className="muted text-sm">
            {notice}
          </p>
        )}
        <RecentTransactions transactions={overview.recent} hideAmounts={isHidden} />
      </div>
      <HomeCategoryBreakdown
        rows={overview.byCategory}
        spent={overview.spent}
        isHidden={isHidden}
      />
      {isQuickOpen && (
        <QuickTransactionDialog
          onClose={() => setIsQuickOpen(false)}
          onSaved={() => {
            setIsQuickOpen(false);
            setNotice('Đã ghi giao dịch vào sổ.');
          }}
        />
      )}
    </div>
  );
};
export default HomePage;
