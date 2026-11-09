import PageState from '../../../base/ui/PageState';
import type { Transaction } from '../../transactions/types';
import useReportData from '../hooks/useReportData';
import ReportCategoryChart from './ReportCategoryChart';
import ReportCategoryDetails from './ReportCategoryDetails';
import ReportDailyChart from './ReportDailyChart';

type ReportStatisticsProps = {
  month: string;
  type: Transaction['type'];
  onTypeChange: (type: Transaction['type']) => void;
};

const ReportStatistics = ({ month, type, onTypeChange }: ReportStatisticsProps) => {
  const { overview, label, transactions, total, breakdown, pieData, daily } = useReportData({
    month,
    type,
  });
  if (overview.isPending) return <PageState kind="loading" message="Đang tổng hợp thống kê…" />;
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
    <div className="statistics-grid">
      <section className="statistics-overview stack-lg" aria-label="Biểu đồ thống kê">
        <ReportCategoryChart
          label={label}
          pieData={pieData}
          total={total}
          transactionCount={transactions.length}
          type={type}
          onTypeChange={onTypeChange}
        />
        <ReportDailyChart label={label} daily={daily} />
      </section>
      <div className="statistics-details stack-lg">
        <ReportCategoryDetails label={label} breakdown={breakdown} />
      </div>
    </div>
  );
};

export default ReportStatistics;
