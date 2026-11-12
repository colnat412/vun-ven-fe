import MonthPicker from '../../../base/ui/MonthPicker';
import ReportStatistics from '../components/ReportStatistics';
import useReportFilters from '../hooks/useReportFilters';

const ReportsPage = () => {
  const { month, setMonth, type, setType } = useReportFilters();
  return (
    <div className="stack-lg">
      <div className="statistics-heading">
        <h1>Báo cáo</h1>
        <div className="month-filter">
          <MonthPicker label="Tháng báo cáo" hideLabel value={month} onValueChange={setMonth} />
        </div>
      </div>
      <ReportStatistics month={month} type={type} onTypeChange={setType} />
    </div>
  );
};
export default ReportsPage;
