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
  categoryId?: string;
  hasLimit?: boolean;
  canSave?: boolean;
  initialAmount: string;
  onClose: () => void;
};
const BudgetEditor = (props: BudgetEditorProps) => {
  const { month, category, categoryId, hasLimit, canSave = true, initialAmount, onClose } = props;
  const { amount, changeAmount, submit, remove, validationError, error, isSaving } = useBudgetForm({
    month,
    category,
    categoryId,
    initialAmount,
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
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
        {!canSave && (
          <p className="small muted">Danh mục đã ngừng sử dụng. Bạn có thể bỏ hạn mức hiện tại.</p>
        )}
        <Button type="submit" isLoading={isSaving} disabled={!canSave}>
          Lưu ngân sách
        </Button>
        {hasLimit && (
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={async () => {
              if (await remove()) onClose();
            }}
          >
            Bỏ hạn mức
          </Button>
        )}
      </form>
    </Modal>
  );
};
export default BudgetEditor;
