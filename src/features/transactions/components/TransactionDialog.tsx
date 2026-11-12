import Modal from '@/base/ui/Modal';
import { useState } from 'react';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import TransactionForm from './TransactionForm';
import TransactionPhoto from './TransactionPhoto';
import type { Transaction } from '../types';

type TransactionDialogProps = {
  open: boolean;
  transaction?: Transaction;
  onClose: () => void;
  title?: string;
  initialDate?: string;
};
const TransactionDialog = (props: TransactionDialogProps) => {
  const {
    open,
    onClose,
    transaction,
    initialDate,
    title = transaction ? 'Sửa giao dịch' : 'Thêm giao dịch',
  } = props;
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!open) return null;
  return (
    <Modal title={title} onClose={onClose}>
      {transaction?.hasPhoto && <TransactionPhoto id={transaction.id} />}
      <TransactionForm
        key={transaction?.id ?? 'new'}
        onSaved={onClose}
        transaction={transaction}
        initialDate={initialDate}
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
