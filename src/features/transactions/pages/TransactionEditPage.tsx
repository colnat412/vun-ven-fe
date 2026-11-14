import { useLocation, useParams } from 'react-router';
import PageHeader from '@/base/ui/PageHeader';
import PageState from '@/base/ui/PageState';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { isValidDate } from '@/base/utils/date';
import { useBook } from '../hooks/useBook';
import TransactionForm from '../components/TransactionForm';
import TransactionPhoto from '../components/TransactionPhoto';

export default function TransactionEditPage() {
  const { transactionId } = useParams();
  const query = useBook();
  const location = useLocation();
  const back = usePageReturn('/transactions');
  const transaction = query.data?.transactions.find((row) => row.id === transactionId);
  const initialDate = isValidDate(location.state?.initialDate)
    ? location.state.initialDate
    : undefined;
  return (
    <div className="page-narrow stack-lg">
      <PageHeader title={transactionId ? 'Sửa giao dịch' : 'Thêm giao dịch'} onBack={back} />
      {query.isPending ? (
        <PageState kind="loading" message="Đang tải giao dịch…" />
      ) : query.error ? (
        <PageState
          kind="error"
          message={GENERIC_API_ERROR_MESSAGE}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : transactionId && !transaction ? (
        <PageState kind="empty" message="Giao dịch không tồn tại trong sổ này." />
      ) : (
        <>
          {transaction?.hasPhoto && <TransactionPhoto id={transaction.id} />}
          <TransactionForm
            key={transactionId ?? 'new'}
            transaction={transaction}
            onSaved={back}
            initialDate={initialDate}
          />
        </>
      )}
    </div>
  );
}
