import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookSelector from '../books/components/BookSelector';
import CreateBookForm from '../books/components/CreateBookForm';
import { useSession } from './session';

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
