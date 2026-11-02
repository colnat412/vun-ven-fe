import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Item, ItemGroup, ItemTitle, ItemSeparator } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Fragment, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import MonthPicker from '../../../shared/ui/MonthPicker';
import PageState from '../../../shared/ui/PageState';
import { currentMonth, daysInMonth, dayOfMonth } from '../../../shared/utils/date';
import { formatMoney, percentage } from '../../../shared/utils/money';
import { categories, categoryColors } from '../../transactions/constants';
import type { Category, Transaction } from '../../transactions/types';
import useOverview from '../../home/hooks/useOverview';
import CategoryBudgets from '../../budgets/components/CategoryBudgets';
import BudgetSummary from '../../budgets/components/BudgetSummary';
import BudgetEditor from '../../budgets/components/BudgetEditor';
import { getCategoryBudgets } from '../../budgets/utils/categoryBudgets';

const ReportsPage = () => {
  const [month, setMonth] = useState(currentMonth);
  const [type, setType] = useState<Transaction['type']>('expense');
  const [editor, setEditor] = useState<{ month: string; category?: Category; amount: string }>();
  const overview = useOverview(month);
  const label = type === 'expense' ? 'Tiền ra' : 'Tiền vào';
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
  const chartConfig = {
    share: { label: 'Tỷ trọng', color: 'var(--primary)' },
    value: { label, color: 'var(--primary)' },
  } satisfies ChartConfig;
  const transactions = overview.transactions.filter((row) => row.type === type);
  const total = type === 'expense' ? overview.spent : overview.income;
  const breakdown = categories.map((category) => {
    const amount = transactions
      .filter((row) => row.category === category)
      .reduce((sum, row) => sum + BigInt(row.amount), 0n);
    return { category, amount, share: percentage(amount, total), color: categoryColors[category] };
  });
  const pieData = breakdown.filter((row) => row.amount > 0n);
  const daily = Array.from({ length: daysInMonth(month) }, (_, index) => ({
    day: index + 1,
    value:
      Number(
        transactions
          .filter((row) => dayOfMonth(row.date) === index + 1)
          .reduce((sum, row) => sum + BigInt(row.amount), 0n),
      ) / 1000,
  }));
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
                                <span className="text-muted-foreground">
                                  {item.payload.category}
                                </span>
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
                  <span>{transactions.length} giao dịch</span>
                </div>
              </div>
              <Tabs value={type} onValueChange={(next) => setType(next as Transaction['type'])}>
                <TabsList className="h-11 w-full rounded-full">
                  <TabsTrigger className="rounded-full" value="expense">
                    Tiền ra
                  </TabsTrigger>
                  <TabsTrigger className="rounded-full" value="income">
                    Tiền vào
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {transactions.length === 0 && (
                <p className="small muted mt-4 text-center">
                  Chưa có {label.toLowerCase()} trong tháng này.
                </p>
              )}
            </CardContent>
          </Card>
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
                          formatter={(value) =>
                            `${Number(value).toLocaleString('vi-VN')} nghìn đồng`
                          }
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
        </section>
        <div className="statistics-details stack-lg">
          {type === 'expense' ? (
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tiền vào theo danh mục</CardTitle>
                <Badge variant="secondary">{categories.length} danh mục</Badge>
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
                          <ItemTitle className="flex items-center gap-2 text-sm">
                            <span
                              className="size-2 rounded-full"
                              style={{ background: row.color }}
                            />
                            {row.category}
                          </ItemTitle>
                          <strong className="text-sm">{formatMoney(row.amount)}</strong>
                        </div>
                        <Progress
                          value={row.share}
                          aria-label={`Tỷ trọng tiền vào ${row.category}`}
                          indicatorStyle={{ background: row.color }}
                          className="mt-3 bg-muted"
                        />
                        <p className="small muted mt-2">{row.share.toFixed(0)}% tiền vào</p>
                      </Item>
                    </Fragment>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
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
