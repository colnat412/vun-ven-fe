import { Link } from 'react-router';
import PageState from '../../../base/ui/PageState';
import { categories, wallets } from '../constants';
import { useBook } from '../hooks/useBook';
import TransactionFormFields from './TransactionFormFields';
import type { Transaction } from '../types';

type TransactionFormProps = {
  onSaved: () => void;
  transaction?: Transaction;
  initialDate?: string;
};
const TransactionForm = (props: TransactionFormProps) => {
  const { onSaved, transaction, initialDate } = props;
  const query = useBook();
  if (query.isPending) return <PageState kind="loading" message="Đang tải sổ…" />;
  if (query.error)
    return (
      <PageState
        kind="error"
        message={query.error.message}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  if (
    !transaction &&
    (query.data?.categoryOptions?.length === 0 ||
      (query.data?.source === 'server' && !query.data.walletOptions?.length))
  ) {
    return (
      <div className="stack">
        <p className="muted">
          Hãy thêm danh mục và chọn sổ có ví hoạt động trong{' '}
          <Link className="text-link" to="/settings">
            Cài đặt
          </Link>{' '}
          trước khi ghi giao dịch.
        </p>
      </div>
    );
  }
  return (
    <TransactionFormFields
      onSaved={onSaved}
      transaction={transaction}
      initialDate={initialDate}
      categoryOptions={[
        ...new Set([
          ...(query.data?.categoryOptions ?? categories),
          ...(transaction ? [transaction.category] : []),
        ]),
      ]}
      walletOptions={[
        ...new Set([
          ...(query.data?.walletOptions ?? wallets),
          ...(transaction ? [transaction.wallet] : []),
        ]),
      ]}
    />
  );
};
export default TransactionForm;
