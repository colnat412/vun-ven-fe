import { useState, type FormEvent } from 'react';
import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import Modal from '@/base/ui/Modal';
import { FieldError } from '@/components/ui/field';
import type { CategoryDefinition } from '../../transactions/types';
import { useCategoryForm } from '../hooks/useCategoryForm';

type CategoryEditorProps = { category?: CategoryDefinition; onClose: () => void };
const CategoryEditor = (props: CategoryEditorProps) => {
  const { category, onClose } = props;
  const form = useCategoryForm({ category });
  const { name, setName, isSaving, error, reset } = form;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleClose = () => {
    if (!isSaving) onClose();
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await form.submit()) onClose();
  };
  const handleDelete = async () => {
    if (await form.remove()) onClose();
  };
  return (
    <Modal
      title={confirmDelete ? 'Xóa danh mục' : category ? 'Sửa danh mục' : 'Thêm danh mục'}
      onClose={handleClose}
    >
      {confirmDelete ? (
        <div className="stack">
          <p className="break-words">
            Xóa danh mục “{category?.name}” khỏi lựa chọn ghi mới? Giao dịch cũ và báo cáo vẫn được
            giữ nguyên.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="secondary"
              disabled={isSaving}
              onClick={() => {
                setConfirmDelete(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isSaving}
              onClick={() => void handleDelete()}
            >
              {isSaving ? 'Đang xóa…' : 'Xác nhận xóa'}
            </Button>
          </div>
        </div>
      ) : (
        <form className="stack" onSubmit={handleSave}>
          <Input
            label="Tên danh mục"
            value={name}
            maxLength={120}
            required
            autoFocus
            disabled={isSaving}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ví dụ: Sức khỏe"
          />
          <Button type="submit" isLoading={isSaving} disabled={!name.trim()}>
            {category ? 'Lưu danh mục' : 'Thêm danh mục'}
          </Button>
          {category && (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={isSaving}
              onClick={() => {
                setConfirmDelete(true);
                reset();
              }}
            >
              Xóa danh mục
            </Button>
          )}
        </form>
      )}
      {error && <FieldError role="alert">{error.message}</FieldError>}
    </Modal>
  );
};
export default CategoryEditor;
