import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import MonthPicker from '../../../base/ui/MonthPicker';
import PageState from '../../../base/ui/PageState';
import { currentMonth } from '../../../base/utils/date';
import BudgetEditor from '../../budgets/components/BudgetEditor';
import BudgetSummary from '../../budgets/components/BudgetSummary';
import CategoryBudgets from '../../budgets/components/CategoryBudgets';
import { getCategoryBudgets } from '../../budgets/utils/categoryBudgets';
import type { Category, Transaction } from '../../transactions/types';
import ReportCategoryChart from '../components/ReportCategoryChart';
import ReportDailyChart from '../components/ReportDailyChart';
import ReportIncomeCategories from '../components/ReportIncomeCategories';
import useReportData from '../hooks/useReportData';

const ReportsPage = () => {
  const [month, setMonth] = useState(currentMonth);
  const [type, setType] = useState<Transaction['type']>('expense');
  const [editor, setEditor] = useState<{
    month: string;
    category?: Category;
    amount: string;
  }>();
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
    <div className="stack-lg">
      <div className="statistics-heading">
        <h1>Thống kê</h1>
        <div className="month-filter">
          <MonthPicker label="Tháng thống kê" hideLabel value={month} onValueChange={setMonth} />
        </div>
      </div>
      <div className="statistics-grid">
        <section className="statistics-overview stack-lg" aria-label="Biểu đồ thống kê">
          <ReportCategoryChart
            label={label}
            pieData={pieData}
            total={total}
            transactionCount={transactions.length}
            type={type}
            onTypeChange={setType}
          />
          <ReportDailyChart label={label} daily={daily} />
        </section>
        <div className="statistics-details stack-lg">
          {type === 'expense' && overview.data?.source === 'server' ? (
            <Card>
              <CardContent>
                <p className="muted small">
                  Thu chi của sổ được tổng hợp ở biểu đồ. Tính năng đặt ngân sách cho tài khoản sẽ
                  được bổ sung sau.
                </p>
              </CardContent>
            </Card>
          ) : type === 'expense' ? (
            <>
              <BudgetSummary
                month={month}
                budget={overview.budget}
                spent={overview.spent}
                usedPercent={overview.usedPercent}
                onEdit={() => setEditor({ month, amount: overview.budget.toString() })}
              />
              <CategoryBudgets
                rows={getCategoryBudgets(overview.data!, month)}
                totalBudget={overview.budget}
                onEdit={(category, amount) => setEditor({ month, category, amount })}
              />
            </>
          ) : (
            <ReportIncomeCategories breakdown={breakdown} />
          )}
        </div>
      </div>
      {editor && (
        <BudgetEditor
          month={editor.month}
          category={editor.category}
          initialAmount={editor.amount}
          onClose={() => setEditor(undefined)}
        />
      )}
    </div>
  );
};
export default ReportsPage;
