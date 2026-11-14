import { Link } from 'react-router';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import IconButton from '@/base/ui/IconButton';
import Button from '@/base/ui/Button';
import Modal from '@/base/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookSelector from '../books/components/BookSelector';
import CreateBookForm from '../books/components/CreateBookForm';
import { useSession } from './session';

const AccountSettings = () => {
  const session = useSession();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Sổ tài khoản</CardTitle>
        {session && (
          <IconButton label="Thêm sổ" onClick={() => setCreateOpen(true)} disabled={creating}>
            <Plus size={20} aria-hidden="true" />
          </IconButton>
        )}
      </CardHeader>
      <CardContent className="stack min-w-0">
        {session ? (
          <>
            <BookSelector />
            {session.bookId && (
              <Link className="text-link" to="/transactions">
                Mở giao dịch của sổ →
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="small muted">
              Đăng nhập để tạo và quản lý sổ tài khoản. Bạn vẫn có thể ghi thu chi trên thiết bị
              này.
            </p>
            <Button asChild className="min-h-11 rounded-xl px-4 py-3 text-sm">
              <Link to="/login" state={{ from: '/settings' }}>
                Đăng nhập
              </Link>
            </Button>
          </>
        )}
      </CardContent>
      {session && createOpen && (
        <Modal
          title="Tạo sổ mới"
          description="Đặt tên cho sổ thu chi của bạn."
          onClose={() => {
            if (!creating) setCreateOpen(false);
          }}
        >
          <CreateBookForm onCreated={() => setCreateOpen(false)} onBusyChange={setCreating} />
        </Modal>
      )}
    </Card>
  );
};
export default AccountSettings;
