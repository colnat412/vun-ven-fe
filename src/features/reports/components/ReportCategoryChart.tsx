import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cell, Pie, PieChart } from 'recharts';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatMoney } from '../../../base/utils/money';
import type { Transaction } from '../../transactions/types';
import type { ReportCategoryRow } from '../types';

type ReportCategoryChartProps = {
  label: string;
  pieData: ReportCategoryRow[];
  total: bigint;
  transactionCount: number;
  type: Transaction['type'];
  onTypeChange: (type: Transaction['type']) => void;
};
const ReportCategoryChart = (props: ReportCategoryChartProps) => {
  const { label, pieData, total, transactionCount, type, onTypeChange } = props;
  const chartConfig = {
    share: { label: 'Tỷ trọng', color: 'var(--primary)' },
    value: { label, color: 'var(--primary)' },
  } satisfies ChartConfig;
  return (
    <Card className="statistics-donut">
      <CardHeader>
        <CardTitle>{label} theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="chart-box donut-chart"
          role="img"
          aria-label={`Biểu đồ tỷ trọng ${label.toLowerCase()} theo danh mục; số liệu chi tiết ở danh sách danh mục`}
        >
          <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
            <PieChart>
              <Pie
                data={
                  pieData.length
                    ? pieData
                    : [{ category: 'Chưa có giao dịch', share: 100, color: 'var(--muted)' }]
                }
                dataKey="share"
                nameKey="category"
                innerRadius="72%"
                outerRadius="92%"
                paddingAngle={pieData.length > 1 ? 3 : 0}
                cornerRadius={8}
                stroke="none"
                isAnimationActive={false}
              >
                {(pieData.length
                  ? pieData
                  : [{ category: 'Chưa có giao dịch', color: 'var(--muted)' }]
                ).map((row) => (
                  <Cell key={row.category} fill={row.color} />
                ))}
              </Pie>
              {pieData.length > 0 && (
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="category"
                      formatter={(value, _name, item) => (
                        <>
                          <span className="text-muted-foreground">{item.payload.category}</span>
                          <span className="ml-auto font-medium tabular-nums">
                            {Number(value).toFixed(1)}%
                          </span>
                        </>
                      )}
                    />
                  }
                />
              )}
            </PieChart>
          </ChartContainer>
          <div className="donut-total" aria-live="polite">
            <span>{label}</span>
            <strong>{formatMoney(total)}</strong>
            <span>{transactionCount} giao dịch</span>
          </div>
        </div>
        <Tabs value={type} onValueChange={(next) => onTypeChange(next as Transaction['type'])}>
          <TabsList className="h-11 w-full rounded-full">
            <TabsTrigger className="rounded-full" value="expense">
              <ArrowUpRight size={16} aria-hidden="true" />
              Tiền ra
            </TabsTrigger>
            <TabsTrigger className="rounded-full" value="income">
              <ArrowDownLeft size={16} aria-hidden="true" />
              Tiền vào
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {transactionCount === 0 && (
          <p className="small muted mt-4 text-center">
            Chưa có {label.toLowerCase()} trong tháng này.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
export default ReportCategoryChart;
