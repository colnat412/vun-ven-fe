import { useState } from 'react';
import Button from '@/base/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';
import CategoryManager from './CategoryManager';

const CategorySettings = () => {
  const query = useBook();
  const session = useSession();
  const [open, setOpen] = useState(false);
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
        <Button variant="secondary" disabled={!canEdit} onClick={() => setOpen(true)}>
          Điều chỉnh
        </Button>
      </CardContent>
      {open && <CategoryManager onClose={() => setOpen(false)} />}
    </Card>
  );
};
export default CategorySettings;
