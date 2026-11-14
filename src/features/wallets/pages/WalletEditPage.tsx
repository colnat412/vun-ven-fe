import { Link, useParams } from 'react-router';
import PageHeader from '@/base/ui/PageHeader';
import PageState from '@/base/ui/PageState';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useBook } from '../../transactions/hooks/useBook';
import { useSession } from '../../auth/session';
import WalletEditor from '../components/WalletEditor';

export default function WalletEditPage() {
  const { walletId } = useParams();
  const query = useBook();
  const session = useSession();
  const back = usePageReturn('/settings/wallets');
  const rows = query.data?.walletDefinitions ?? [];
  const wallet = rows.find((row) => row.id === walletId);
  return (
    <div className="page-narrow stack-lg">
      <PageHeader
        title={walletId ? 'Điều chỉnh ngân hàng / ví' : 'Thêm ngân hàng / ví'}
        onBack={back}
      />
      {session && !session.bookId ? (
        <p>
          Hãy chọn sổ trong{' '}
          <Link className="text-link" to="/settings">
            Cài đặt
          </Link>{' '}
          để tiếp tục.
        </p>
      ) : query.isPending ? (
        <PageState kind="loading" message="Đang tải ví…" />
      ) : query.error ? (
        <PageState
          kind="error"
          message={GENERIC_API_ERROR_MESSAGE}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : walletId && !wallet ? (
        <PageState kind="empty" message="Ví không tồn tại trong sổ này." />
      ) : (
        <WalletEditor key={walletId ?? 'new'} wallet={wallet} wallets={rows} onClose={back} />
      )}
    </div>
  );
}
