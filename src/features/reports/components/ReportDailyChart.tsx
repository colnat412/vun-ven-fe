import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ReportDayRow } from '../types';

type ReportDailyChartProps = {
  label: string;
  daily: ReportDayRow[];
};
const ReportDailyChart = (props: ReportDailyChartProps) => {
  const { label, daily } = props;
  const chartConfig = {
    share: { label: 'Tỷ trọng', color: 'var(--primary)' },
    value: { label, color: 'var(--primary)' },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label} trong tháng</CardTitle>
        <CardDescription>Đơn vị: nghìn đồng</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="chart-box"
          role="img"
          aria-label={`Biểu đồ ${label.toLowerCase()} theo ngày`}
        >
          <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
            <BarChart data={daily}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                minTickGap={18}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Ngày ${value}`}
                    formatter={(value) => `${Number(value).toLocaleString('vi-VN')} nghìn đồng`}
                  />
                }
              />
              <Bar
                isAnimationActive={false}
                dataKey="value"
                fill="var(--primary)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <Collapsible className="small muted">
          <CollapsibleTrigger className="text-primary hover:underline">
            Xem số liệu theo ngày
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 grid gap-2">
            {daily
              .filter((row) => row.value > 0)
              .map((row) => (
                <div className="row" key={row.day}>
                  <span>Ngày {row.day}</span>
                  <span>{row.value.toLocaleString('vi-VN')} nghìn đồng</span>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
export default ReportDailyChart;
