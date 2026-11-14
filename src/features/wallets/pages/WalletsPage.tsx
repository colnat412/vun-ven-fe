import { ChevronRight, Plus } from 'lucide-react';
import WalletIcon from '../components/WalletIcon';
import { Link, useLocation, useNavigate } from 'react-router';
import Button from '@/base/ui/Button';
import PageHeader from '@/base/ui/PageHeader';
import PageState from '@/base/ui/PageState';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useBook } from '../../transactions/hooks/useBook';
import { useSession } from '../../auth/session';
import { walletKinds } from '../constants';

export default function WalletsPage() {
  const session = useSession();
  const query = useBook();
  const back = usePageReturn('/settings');
  const location = useLocation();
  const navigate = useNavigate();
  const rows = query.data?.walletDefinitions ?? [];
  const canEdit = !session || !!session.bookId;
  const edit = (id?: string) =>
    navigate(id ? `/settings/wallets/${encodeURIComponent(id)}/edit` : '/settings/wallets/new', {
      state: { returnTo: location.pathname + location.search },
    });
  return (
    <div className="page-narrow stack-lg">
      <PageHeader title="Ngân hàng & ví" onBack={back} />
      {!canEdit ? (
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
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="small muted">{rows.filter((row) => row.isActive).length} ví đang dùng</p>
            <Button variant="secondary" onClick={() => edit()}>
              <Plus size={16} aria-hidden="true" />
              Thêm ngân hàng / ví
            </Button>
          </div>
          <p className="small muted">Ngân hàng và ví bạn dùng để trả tiền hoặc nhận tiền.</p>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
            {rows
              .filter((row) => row.isActive)
              .map((row) => (
                <li key={row.id}>
                  <Button
                    variant="unstyled"
                    type="button"
                    className="flex min-h-16 w-full min-w-0 items-center gap-3 py-3 text-left hover:text-primary"
                    aria-label={`Điều chỉnh ví ${row.name}`}
                    onClick={() => edit(row.id)}
                  >
                    <WalletIcon wallet={row} size={32} />
                    <span className="min-w-0 flex-1">
                      <strong className="block break-words text-sm">{row.name}</strong>
                      <span className="small muted">{walletKinds[row.kind]}</span>
                    </span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Button>
                </li>
              ))}
          </ul>
          {rows.some((row) => !row.isActive) && (
            <details>
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Ví đã ngừng dùng
              </summary>
              <ul className="mt-3 divide-y divide-border">
                {rows
                  .filter((row) => !row.isActive)
                  .map((row) => (
                    <li key={row.id}>
                      <Button
                        variant="unstyled"
                        type="button"
                        className="flex min-h-12 w-full items-center justify-between gap-3 py-2 text-left text-sm"
                        onClick={() => edit(row.id)}
                      >
                        <WalletIcon wallet={row} size={24} />
                        <span className="min-w-0 flex-1 break-words">{row.name}</span>
                        <span className="shrink-0 text-primary">Dùng lại</span>
                      </Button>
                    </li>
                  ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}
