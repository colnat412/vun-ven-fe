import { useLocation, useNavigate } from 'react-router';
import Button from '@/base/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';

const CategorySettings = () => {
  const query = useBook();
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const canEdit = !session || !!session.bookId;
  const count = query.data?.categoryDefinitions?.filter((row) => row.isActive).length ?? 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh mục thu chi</CardTitle>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        {!canEdit ? (
          <p className="small muted">
            Chọn hoặc tạo sổ ở mục Sổ tài khoản phía trên để quản lý danh mục.
          </p>
        ) : (
          <p className="small muted">
            {query.isPending
              ? 'Đang tải danh mục…'
              : query.error
                ? 'Chưa tải được danh mục.'
                : `${count} danh mục · ${session ? 'Sổ đang chọn' : 'Trên thiết bị này'}`}
          </p>
        )}
        <Button
          variant="secondary"
          disabled={!canEdit}
          onClick={() =>
            navigate('/settings/categories', {
              state: { returnTo: location.pathname + location.search },
            })
          }
        >
          Điều chỉnh
        </Button>
      </CardContent>
    </Card>
  );
};
export default CategorySettings;
