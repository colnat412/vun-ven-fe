import type { FormEvent } from 'react';
import { FieldDescription, FieldError, FieldGroup } from '@/components/ui/field';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '../../../base/ui/Button';
import DatePicker from '../../../base/ui/DatePicker';
import Input from '../../../base/ui/Input';
import MoneyInput from '../../../base/ui/MoneyInput';
import SelectField from '../../../base/ui/SelectField';
import useTransactionForm from '../hooks/useTransactionForm';
import type { Transaction, TransactionInput } from '../types';
import { currentTime, dateKey, hasTime } from '../../../base/utils/date';

type TransactionFormFieldsProps = {
  onSaved: () => void;
  transaction?: Transaction;
  onDelete?: () => void;
  categoryOptions: TransactionInput['category'][];
  walletOptions: string[];
  initialDate?: string;
};
const TransactionFormFields = (props: TransactionFormFieldsProps) => {
  const { onSaved, categoryOptions, walletOptions, transaction, onDelete, initialDate } = props;
  const { values, setField, submit, isSaving, error } = useTransactionForm({
    transactionId: transaction?.id,
    initialValues: transaction
      ? {
          amount: transaction.amount,
          note: transaction.note,
          category: transaction.category,
          wallet: transaction.wallet,
          type: transaction.type,
          date: dateKey(transaction.date),
          time: hasTime(transaction.date) ? currentTime(new Date(transaction.date)) : '',
        }
      : {
          category: categoryOptions[0],
          wallet: walletOptions[0],
          ...(initialDate ? { date: initialDate } : {}),
        },
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await submit()) onSaved();
  };
  return (
    <form className="stack transaction-form" onSubmit={handleSubmit}>
      <Tabs
        value={values.type}
        onValueChange={(value) => setField('type', value as TransactionInput['type'])}
      >
        <TabsList className="w-full">
          <TabsTrigger value="expense">Tiền ra</TabsTrigger>
          <TabsTrigger value="income">Tiền vào</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="amount-entry">
        <MoneyInput
          label="Số tiền (VND)"
          minimum={1n}
          placeholder="Ví dụ: 65,000"
          value={values.amount}
          onValueChange={(amount) => setField('amount', amount)}
          required
          autoFocus
        />
        <p className="small muted">VND · Nhập số tiền cần ghi vào sổ</p>
      </div>
      <Input
        label="Ghi chú"
        placeholder="Nội dung giao dịch"
        maxLength={160}
        value={values.note}
        onChange={(event) => setField('note', event.target.value)}
      />
      <FieldGroup className="form-grid grid gap-4">
        <SelectField
          label="Danh mục"
          value={values.category}
          options={categoryOptions}
          onValueChange={(value) => setField('category', value as TransactionInput['category'])}
        />
        <SelectField
          label={values.type === 'expense' ? 'Thanh toán bằng' : 'Nhận tiền vào'}
          value={values.wallet}
          options={walletOptions}
          onValueChange={(value) => setField('wallet', value)}
        />
      </FieldGroup>
      <FieldGroup className="form-grid grid gap-4">
        <DatePicker
          label="Ngày giao dịch"
          value={values.date}
          onValueChange={(date) => setField('date', date)}
        />
        <Input
          label="Giờ giao dịch"
          type="time"
          step={60}
          value={values.time}
          onChange={(event) => setField('time', event.target.value)}
          required
        />
      </FieldGroup>
      <FieldDescription className="small muted">Giờ Việt Nam (UTC+7)</FieldDescription>
      {error && <FieldError className="field-error">{error}</FieldError>}
      <Button type="submit" isLoading={isSaving}>
        {transaction ? 'Lưu thay đổi' : 'Lưu giao dịch'}
      </Button>
      {onDelete && (
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={isSaving}
          onClick={onDelete}
        >
          Xóa giao dịch
        </Button>
      )}
    </form>
  );
};
export default TransactionFormFields;
