import { Link } from 'react-router';
import Button from '@/base/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookSelector from '../books/components/BookSelector';
import CreateBookForm from '../books/components/CreateBookForm';
import { setSession, useSession } from './session';

const AccountSettings = () => {
  const session = useSession();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sổ tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="stack min-w-0">
        {session ? (
          <>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <strong className="block break-words">{session.user.displayName}</strong>
                <p className="small muted break-all">{session.user.email}</p>
              </div>
              <Button variant="ghost" onClick={() => setSession(null)}>
                Đăng xuất
              </Button>
            </div>
            <BookSelector />
            <div className="border-t border-border pt-4">
              <CreateBookForm />
            </div>
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
            <Link
              className="button button--primary inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
              to="/login"
              state={{ from: '/settings' }}
            >
              Đăng nhập
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};
export default AccountSettings;
