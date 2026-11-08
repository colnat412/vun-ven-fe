import Button from '@/base/ui/Button';
import Modal from '@/base/ui/Modal';
import { useDeleteTransaction } from '../hooks/useDeleteTransaction';
import type { Transaction } from '../types';

type DeleteTransactionDialogProps = {
  transaction: Transaction;
  onClose: () => void;
  onDeleted: () => void;
};
const DeleteTransactionDialog = (props: DeleteTransactionDialogProps) => {
  const { transaction, onClose, onDeleted } = props;
  const mutation = useDeleteTransaction();
  const handleClose = () => {
    if (!mutation.isPending) onClose();
  };
  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(transaction.id);
      onDeleted();
    } catch {
      // Keep the confirmation open so the user can retry.
    }
  };
  return (
    <Modal title="Xóa giao dịch" onClose={handleClose}>
      <p>
        Bạn có chắc muốn xóa giao dịch “{transaction.note || transaction.category}”? Thao tác này
        không thể hoàn tác.
      </p>
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" disabled={mutation.isPending} onClick={handleClose}>
          Hủy
        </Button>
        <Button
          className="bg-destructive text-white hover:bg-destructive/90"
          disabled={mutation.isPending}
          aria-busy={mutation.isPending || undefined}
          onClick={() => void handleDelete()}
        >
          {mutation.isPending ? 'Đang xóa…' : 'Xóa giao dịch'}
        </Button>
      </div>
    </Modal>
  );
};
export default DeleteTransactionDialog;
