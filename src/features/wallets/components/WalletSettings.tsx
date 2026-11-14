import { useLocation, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/base/ui/Button';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useBook } from '../../transactions/hooks/useBook';
import { useSession } from '../../auth/session';

export default function WalletSettings() {
  const session = useSession();
  const query = useBook();
  const navigate = useNavigate();
  const location = useLocation();
  const canEdit = !session || !!session.bookId;
  const count = query.data?.walletDefinitions?.filter((row) => row.isActive).length ?? 0;
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
                : `${count} ví đang dùng · ${session ? 'Sổ đang chọn' : 'Trên thiết bị này'}`}
        </p>
        <Button
          variant="secondary"
          disabled={!canEdit}
          onClick={() =>
            navigate('/settings/wallets', {
              state: { returnTo: location.pathname + location.search },
            })
          }
        >
          Điều chỉnh ví
        </Button>
      </CardContent>
    </Card>
  );
}
