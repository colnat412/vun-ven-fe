import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemGroup, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { Fragment } from 'react';
import { formatMoney } from '../../../base/utils/money';
import type { ReportCategoryRow } from '../types';

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
        <ItemGroup className="statistics-categories">
          {breakdown.map((row, index) => (
            <Fragment key={row.category}>
              {index > 0 && <ItemSeparator />}
              <Item
                className="statistics-category block rounded-none border-0 px-0 py-4"
                role="listitem"
                key={row.category}
              >
                <div className="row">
                  <ItemTitle className="flex min-w-0 items-center gap-2 text-sm">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: row.color }}
                    />
                    <span className="truncate" title={row.category}>
                      {row.category}
                    </span>
                  </ItemTitle>
                  <strong className="shrink-0 text-sm">{formatMoney(row.amount)}</strong>
                </div>
                <Progress
                  value={row.share}
                  aria-label={`Tỷ trọng ${label.toLowerCase()} ${row.category}`}
                  indicatorStyle={{ background: row.color }}
                  className="mt-3 bg-muted"
                />
                <p className="small muted mt-2">
                  {row.share.toFixed(0)}% {label.toLowerCase()}
                </p>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
};
export default ReportCategoryDetails;
