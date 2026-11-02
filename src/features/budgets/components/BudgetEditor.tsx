import { FieldError } from '@/components/ui/field';
import { useState } from 'react';
import Modal from '../../../shared/ui/Modal';
import MoneyInput from '../../../shared/ui/MoneyInput';
import Button from '../../../shared/ui/Button';
import { monthLabel } from '../../../shared/utils/date';
import { useUpdateBudget } from '../../transactions/hooks/useBook';
import type { Category } from '../../transactions/types';

type BudgetEditorProps = {
  month: string;
  category?: Category;
  initialAmount: string;
  onClose: () => void;
};
const BudgetEditor = ({ month, category, initialAmount, onClose }: BudgetEditorProps) => {
  const [amount, setAmount] = useState(initialAmount);
  const mutation = useUpdateBudget();
  return (
    <Modal
      title={category ? `Hạn mức ${category}` : `Ngân sách ${monthLabel(month).toLowerCase()}`}
      onClose={onClose}
    >
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ month, amount, category }, { onSuccess: onClose });
        }}
      >
        <MoneyInput
          label="Hạn mức (VND)"
          value={amount}
          onValueChange={setAmount}
          required
          autoFocus
        />
        {/* <FieldDescription className="muted small">
          {monthLabel(month)} · Số 0 nghĩa là chưa đặt hạn mức.
          {category && ' Hạn mức danh mục không tự thay đổi tổng ngân sách.'}
        </FieldDescription> */}
        {mutation.error && (
          <FieldError className="field-error">{mutation.error.message}</FieldError>
        )}
        <Button type="submit" isLoading={mutation.isPending}>
          Lưu ngân sách
        </Button>
      </form>
    </Modal>
  );
};
export default BudgetEditor;
