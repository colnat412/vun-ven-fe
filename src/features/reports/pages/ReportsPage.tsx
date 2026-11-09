import { ChartNoAxesCombined, PiggyBank } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MonthPicker from '../../../base/ui/MonthPicker';
import BudgetSection from '../../budgets/components/BudgetSection';
import ReportStatistics from '../components/ReportStatistics';
import useReportFilters from '../hooks/useReportFilters';

const ReportsPage = () => {
  const { month, setMonth, tab, setTab, type, setType } = useReportFilters();
  return (
    <div className="stack-lg">
      <div className="statistics-heading">
        <h1>Báo cáo</h1>
        <div className="month-filter">
          <MonthPicker label="Tháng báo cáo" hideLabel value={month} onValueChange={setMonth} />
        </div>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList aria-label="Nội dung báo cáo" className="w-full min-[640px]:w-80">
          <TabsTrigger value="statistics">
            <ChartNoAxesCombined aria-hidden="true" />
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="budgets">
            <PiggyBank aria-hidden="true" />
            Ngân sách
          </TabsTrigger>
        </TabsList>
        <TabsContent value="statistics">
          <ReportStatistics month={month} type={type} onTypeChange={setType} />
        </TabsContent>
        <TabsContent value="budgets">
          <BudgetSection key={month} month={month} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ReportsPage;
