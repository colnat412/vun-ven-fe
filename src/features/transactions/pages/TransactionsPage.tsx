import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownLeft, ArrowUpRight, Plus, Search } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import Button from '../../../base/ui/Button';
import Input from '../../../base/ui/Input';
import PageState from '../../../base/ui/PageState';
import { compareDateTimeDescending } from '../../../base/utils/date';
import GroupedTransactionList from '../components/GroupedTransactionList';
import { useBook } from '../hooks/useBook';

const TransactionsPage = () => {
  const query = useBook();
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const type = ['expense', 'income'].includes(params.get('type') ?? '')
    ? params.get('type')!
    : 'all';
  const setFilter = (key: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value && value !== 'all') next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  const navigate = useNavigate();
  const location = useLocation();
  const rows = [...(query.data?.transactions ?? [])]
    .filter(
      (row) =>
        (type === 'all' || row.type === type) &&
        `${row.note} ${row.category} ${row.wallet}`
          .toLocaleLowerCase('vi')
          .includes(search.toLocaleLowerCase('vi')),
    )
    .sort((a, b) => compareDateTimeDescending(a.date, b.date));
  return (
    <div className="page-narrow stack-lg">
      <div className="section-heading page-title-row">
        <div>
          <p className="eyebrow">SỔ CÁ NHÂN</p>
          <h1>Giao dịch</h1>
        </div>
        <Button
          onClick={() =>
            navigate('/transactions/new', {
              state: { returnTo: location.pathname + location.search },
            })
          }
        >
          <Plus size={18} />
          Ghi thêm
        </Button>
      </div>
      <div className="stack">
        <Input
          type="search"
          startIcon={<Search />}
          label="Tìm giao dịch"
          placeholder="Tìm ghi chú, danh mục, ví…"
          value={search}
          onChange={(event) => setFilter('q', event.target.value)}
        />
        <Tabs value={type} onValueChange={(value) => setFilter('type', value)}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="expense">
              <ArrowUpRight size={16} aria-hidden="true" />
              Tiền ra
            </TabsTrigger>
            <TabsTrigger value="income">
              <ArrowDownLeft size={16} aria-hidden="true" />
              Tiền vào
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {query.isPending ? (
        <PageState kind="loading" message="Đang tải giao dịch…" />
      ) : query.error ? (
        <PageState
          kind="error"
          message={query.error.message}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : rows.length ? (
        <div className="stack">
          <p className="muted small">{rows.length} giao dịch</p>
          <GroupedTransactionList transactions={rows} />
        </div>
      ) : (
        <PageState kind="empty" message="Không có giao dịch phù hợp." />
      )}
    </div>
  );
};
export default TransactionsPage;
