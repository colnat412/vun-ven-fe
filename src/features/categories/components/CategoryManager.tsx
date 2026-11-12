import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Plus } from 'lucide-react';
import Button from '@/base/ui/Button';
import PageState from '@/base/ui/PageState';
import Modal from '@/base/ui/Modal';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';
import type { CategoryDefinition } from '../../transactions/types';
import CategoryEditor from './CategoryEditor';
import CategoryIcon from '../../transactions/components/CategoryIcon';

type CategoryManagerProps = { onClose: () => void };
const CategoryManager = (props: CategoryManagerProps) => {
  const { onClose } = props;
  const query = useBook();
  const session = useSession();
  const [editing, setEditing] = useState<CategoryDefinition | null>();
  const canEdit = !session || !!session.bookId;
  const rows = query.data?.categoryDefinitions?.filter((row) => row.isActive) ?? [];
  return (
    <Modal title="Điều chỉnh danh mục" onClose={onClose}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="small muted">{rows.length} danh mục</p>
        <Button
          variant="secondary"
          disabled={!canEdit || !query.data || !!query.error}
          onClick={() => setEditing(null)}
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
            message={query.error.message}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <div className="stack">
            <p className="small muted">
              {session ? 'Danh mục của sổ đang chọn.' : 'Danh mục lưu trên thiết bị này.'} Bấm vào
              tên để sửa hoặc xóa. Xóa danh mục vẫn giữ lịch sử giao dịch.
            </p>
            {rows.length ? (
              <ul className="max-h-[45dvh] min-w-0 divide-y divide-border overflow-y-auto overscroll-contain">
                {rows.map((row) => (
                  <li key={row.id} className="min-w-0">
                    <button
                      type="button"
                      className="flex min-h-12 w-full min-w-0 items-center justify-between gap-3 py-3 text-left hover:text-primary"
                      onClick={() => setEditing(row)}
                      aria-label={`Sửa danh mục ${row.name}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <CategoryIcon category={row.name} />
                        <span className="min-w-0 truncate">{row.name}</span>
                      </span>
                      <ChevronRight size={16} className="shrink-0" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Chưa có danh mục. Thêm danh mục để bắt đầu ghi thu chi.</p>
            )}
          </div>
        )}
      </div>
      {editing !== undefined && (
        <CategoryEditor
          key={editing?.id ?? 'new'}
          category={editing ?? undefined}
          onClose={() => setEditing(undefined)}
        />
      )}
    </Modal>
  );
};
export default CategoryManager;
