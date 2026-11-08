import type { FormEvent } from 'react';
import { FieldError } from '@/components/ui/field';
import Button from '../../../base/ui/Button';
import Modal from '../../../base/ui/Modal';
import MoneyInput from '../../../base/ui/MoneyInput';
import { monthLabel } from '../../../base/utils/date';
import type { Category } from '../../transactions/types';
import useBudgetForm from '../hooks/useBudgetForm';

type BudgetEditorProps = {
  month: string;
  category?: Category;
  initialAmount: string;
  onClose: () => void;
};
const BudgetEditor = (props: BudgetEditorProps) => {
  const { month, category, initialAmount, onClose } = props;
  const { amount, changeAmount, submit, validationError, error, isSaving } = useBudgetForm({
    month,
    category,
    initialAmount,
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await submit()) onClose();
  };
  return (
    <Modal
      title={category ? `Hạn mức ${category}` : `Ngân sách ${monthLabel(month).toLowerCase()}`}
      onClose={onClose}
    >
      <form className="stack" onSubmit={handleSubmit}>
        <MoneyInput
          label="Hạn mức (VND)"
          value={amount}
          onValueChange={changeAmount}
          error={validationError || undefined}
          required
          autoFocus
        />
        {error && <FieldError className="field-error">{error}</FieldError>}
        <Button type="submit" isLoading={isSaving}>
          Lưu ngân sách
        </Button>
      </form>
    </Modal>
  );
};
export default BudgetEditor;
