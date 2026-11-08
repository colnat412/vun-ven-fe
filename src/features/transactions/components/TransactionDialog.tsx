import Modal from '@/base/ui/Modal';
import { useState } from 'react';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import TransactionForm from './TransactionForm';
import type { Transaction } from '../types';

type TransactionDialogProps = {
  open: boolean;
  transaction?: Transaction;
  onClose: () => void;
  title?: string;
};
const TransactionDialog = (props: TransactionDialogProps) => {
  const {
    open,
    onClose,
    transaction,
    title = transaction ? 'Sửa giao dịch' : 'Thêm giao dịch',
  } = props;
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!open) return null;
  return (
    <Modal title={title} onClose={onClose}>
      <TransactionForm
        key={transaction?.id ?? 'new'}
        onSaved={onClose}
        transaction={transaction}
        onDelete={transaction ? () => setConfirmDelete(true) : undefined}
      />
      {transaction && confirmDelete && (
        <DeleteTransactionDialog
          transaction={transaction}
          onClose={() => setConfirmDelete(false)}
          onDeleted={() => {
            setConfirmDelete(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
};
export default TransactionDialog;
