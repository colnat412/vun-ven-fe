import { Link, useParams } from 'react-router';
import PageHeader from '@/base/ui/PageHeader';
import PageState from '@/base/ui/PageState';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useBook } from '../../transactions/hooks/useBook';
import { useSession } from '../../auth/session';
import CategoryEditor from '../components/CategoryEditor';

export default function CategoryEditPage() {
  const { categoryId } = useParams();
  const query = useBook();
  const session = useSession();
  const back = usePageReturn('/settings/categories');
  const category = query.data?.categoryDefinitions?.find(
    (row) => row.id === categoryId && row.isActive,
  );
  return (
    <div className="page-narrow stack-lg">
      <PageHeader title={categoryId ? 'Sửa danh mục' : 'Thêm danh mục'} onBack={back} />
      {session && !session.bookId ? (
        <p>
          Hãy chọn sổ trong{' '}
          <Link className="text-link" to="/settings">
            Cài đặt
          </Link>{' '}
          để tiếp tục.
        </p>
      ) : query.isPending ? (
        <PageState kind="loading" message="Đang tải danh mục…" />
      ) : query.error ? (
        <PageState
          kind="error"
          message={GENERIC_API_ERROR_MESSAGE}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : categoryId && !category ? (
        <PageState kind="empty" message="Danh mục không còn hoạt động hoặc không tồn tại." />
      ) : (
        <CategoryEditor key={categoryId ?? 'new'} category={category} onClose={back} />
      )}
    </div>
  );
}
