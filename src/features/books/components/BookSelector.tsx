import Button from '@/base/ui/Button';
import SelectField from '@/base/ui/SelectField';
import { Link } from 'react-router';
import { setSession, useSession } from '../../auth/session';
import { useAccountBooks } from '../hooks/useAccountBooks';

const BookSelector = () => {
  const session = useSession();
  const query = useAccountBooks();
  if (!session) return null;
  return (
    <>
      <SelectField
        label="Sổ đang sử dụng"
        placeholder={query.isPending ? 'Đang tải danh sách sổ…' : 'Chọn hoặc tạo sổ'}
        value={session.bookId}
        disabled={query.isPending || !!query.error}
        options={query.data?.map((book) => ({ value: book.id, label: book.name })) ?? []}
        onValueChange={(bookId) => setSession({ ...session, bookId })}
      />
      {query.isPending && (
        <p role="status" className="small muted">
          Đang tải danh sách sổ…
        </p>
      )}
      {query.error && (
        <div className="stack">
          <p role="alert" className="field-error">
            {query.error.message}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              void query.refetch();
            }}
          >
            Tải lại danh sách sổ
          </Button>
          <Link className="text-link" to="/login">
            Đăng nhập lại
          </Link>
        </div>
      )}
      {!query.isPending && !query.error && !session.bookId && (
        <p className="small muted">Tạo sổ đầu tiên để bắt đầu ghi thu chi.</p>
      )}
    </>
  );
};
export default BookSelector;
