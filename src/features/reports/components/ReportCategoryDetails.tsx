import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReportCategoryRow } from '../types';
import CategoryJarGrid from '../../transactions/components/CategoryJarGrid';

type ReportCategoryDetailsProps = {
  label: string;
  breakdown: ReportCategoryRow[];
};
const ReportCategoryDetails = (props: ReportCategoryDetailsProps) => {
  const { label, breakdown } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{label} theo danh mục</CardTitle>
        <Badge variant="secondary">{breakdown.length} danh mục</Badge>
      </CardHeader>
      <CardContent>
        {breakdown.length ? (
          <CategoryJarGrid
            rows={breakdown}
            label={label === 'Tiền vào' ? 'tổng thu' : 'tổng chi'}
          />
        ) : (
          <p className="muted">Chưa có {label.toLowerCase()} trong kỳ này.</p>
        )}
      </CardContent>
    </Card>
  );
};
export default ReportCategoryDetails;
