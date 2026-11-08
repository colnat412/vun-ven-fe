import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../base/ui/Button';
import Input from '../../../base/ui/Input';
import PageState from '../../../base/ui/PageState';
import { compareDateTimeDescending } from '../../../base/utils/date';
import TransactionDialog from '../../transactions/components/TransactionDialog';
import GroupedTransactionList from '../components/GroupedTransactionList';
import { useBook } from '../hooks/useBook';

const TransactionsPage = () => {
  const query = useBook();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
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
        <Button onClick={() => setIsOpen(true)}>
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
          onChange={(event) => setSearch(event.target.value)}
        />
        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="expense">Tiền ra</TabsTrigger>
            <TabsTrigger value="income">Tiền vào</TabsTrigger>
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
      <TransactionDialog open={isOpen} title="Thêm giao dịch" onClose={() => setIsOpen(false)} />
    </div>
  );
};
export default TransactionsPage;
