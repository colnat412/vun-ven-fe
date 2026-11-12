import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/base/ui/Button';
import Modal from '@/base/ui/Modal';
import PageState from '@/base/ui/PageState';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useBook } from '../../transactions/hooks/useBook';
import { useSession } from '../../auth/session';
import type { WalletDefinition } from '../../transactions/types';
import { walletKinds } from '../constants';
import WalletEditor from './WalletEditor';

const WalletSettings = () => {
  const session = useSession();
  const query = useBook();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WalletDefinition | null>();
  const canEdit = !session || !!session.bookId;
  const rows = query.data?.walletDefinitions ?? [];
  const active = rows.filter((row) => row.isActive);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ngân hàng & ví</CardTitle>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="small muted">
          {!canEdit
            ? 'Chọn hoặc tạo sổ phía trên để quản lý ví.'
            : query.isPending
              ? 'Đang tải ví…'
              : query.error
                ? GENERIC_API_ERROR_MESSAGE
                : `${active.length} ví đang dùng · ${session ? 'Sổ đang chọn' : 'Trên thiết bị này'}`}
        </p>
        <Button variant="secondary" disabled={!canEdit} onClick={() => setOpen(true)}>
          Điều chỉnh ví
        </Button>
      </CardContent>
      {open && (
        <Modal
          title="Ngân hàng & ví"
          onClose={() => {
            setOpen(false);
            setEditing(undefined);
          }}
        >
          {query.isPending ? (
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
            <div className="stack">
              <p className="small muted">
                Thêm ngân hàng hoặc ví điện tử bạn dùng để trả tiền và nhận tiền.
              </p>
              <Button variant="secondary" disabled={!canEdit} onClick={() => setEditing(null)}>
                <Plus size={16} aria-hidden="true" />
                Thêm ngân hàng / ví
              </Button>
              <ul className="max-h-[45dvh] divide-y divide-border overflow-y-auto">
                {active.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="flex min-h-14 w-full min-w-0 items-center justify-between gap-3 py-3 text-left"
                      onClick={() => setEditing(row)}
                      aria-label={`Điều chỉnh ví ${row.name}`}
                    >
                      <span className="min-w-0">
                        <strong className="block break-words text-sm">{row.name}</strong>
                        <span className="small muted">{walletKinds[row.kind]}</span>
                      </span>
                      <ChevronRight size={16} className="shrink-0" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              {rows.some((row) => !row.isActive) && (
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Ví đã ngừng dùng
                  </summary>
                  <ul className="mt-2 divide-y divide-border">
                    {rows
                      .filter((row) => !row.isActive)
                      .map((row) => (
                        <li key={row.id}>
                          <button
                            type="button"
                            className="flex min-h-12 w-full items-center justify-between gap-3 py-2 text-left text-sm"
                            onClick={() => setEditing(row)}
                          >
                            <span className="min-w-0 break-words">{row.name}</span>
                            <span className="shrink-0 text-primary">Dùng lại</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </details>
              )}
            </div>
          )}
          {editing !== undefined && (
            <WalletEditor
              key={editing?.id ?? 'new'}
              wallet={editing ?? undefined}
              wallets={rows}
              onClose={() => setEditing(undefined)}
            />
          )}
        </Modal>
      )}
    </Card>
  );
};
export default WalletSettings;
