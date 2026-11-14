import { Link, useLocation, useNavigate } from 'react-router';
import { ChevronRight, Plus } from 'lucide-react';
import Button from '@/base/ui/Button';
import PageState from '@/base/ui/PageState';
import PageHeader from '@/base/ui/PageHeader';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';
import CategoryIcon from '../../transactions/components/CategoryIcon';

const CategoryManager = () => {
  const back = usePageReturn('/settings');
  const location = useLocation();
  const navigate = useNavigate();
  const query = useBook();
  const session = useSession();
  const canEdit = !session || !!session.bookId;
  const rows = query.data?.categoryDefinitions?.filter((row) => row.isActive) ?? [];
  return (
    <div className="page-narrow stack-lg">
      <PageHeader title="Danh mục thu chi" onBack={back} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="small muted">{rows.length} danh mục</p>
        <Button
          variant="secondary"
          disabled={!canEdit || !query.data || !!query.error}
          onClick={() =>
            navigate('/settings/categories/new', {
              state: { returnTo: location.pathname + location.search },
            })
          }
        >
          <Plus size={16} aria-hidden="true" />
          Thêm danh mục
        </Button>
      </div>
      <div className="min-w-0">
        {!canEdit ? (
          <p className="muted">
            Hãy{' '}
            <Link className="text-link" to="/account">
              chọn hoặc tạo sổ
            </Link>{' '}
            để quản lý danh mục.
          </p>
        ) : query.isPending ? (
          <PageState kind="loading" message="Đang tải danh mục…" />
        ) : query.error ? (
          <PageState
            kind="error"
            message={GENERIC_API_ERROR_MESSAGE}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <div className="stack">
            <p className="small muted">
              {session ? 'Danh mục của sổ đang chọn.' : 'Danh mục lưu trên thiết bị này.'} Bấm vào
              tên để sửa hoặc xóa. Xóa danh mục vẫn giữ lịch sử giao dịch.
            </p>
            {rows.length ? (
              <ul className="min-w-0 divide-y divide-border rounded-2xl border border-border bg-card px-4">
                {rows.map((row) => (
                  <li key={row.id} className="min-w-0">
                    <Button
                      variant="unstyled"
                      type="button"
                      className="flex min-h-12 w-full min-w-0 items-center justify-between gap-3 py-3 text-left hover:text-primary"
                      onClick={() =>
                        navigate(`/settings/categories/${encodeURIComponent(row.id)}/edit`, {
                          state: { returnTo: location.pathname + location.search },
                        })
                      }
                      aria-label={`Sửa danh mục ${row.name}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <CategoryIcon category={row.name} />
                        <span className="min-w-0 truncate">{row.name}</span>
                      </span>
                      <ChevronRight size={16} className="shrink-0" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Chưa có danh mục. Thêm danh mục để bắt đầu ghi thu chi.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryManager;
