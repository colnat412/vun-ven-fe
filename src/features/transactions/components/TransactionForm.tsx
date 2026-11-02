import { FieldGroup, FieldDescription, FieldError } from '@/components/ui/field';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input';
import MoneyInput from '../../../shared/ui/MoneyInput';
import DatePicker from '../../../shared/ui/DatePicker';
import { categories, wallets } from '../constants';
import useTransactionForm from '../hooks/useTransactionForm';
import type { TransactionInput } from '../types';
import SelectField from '../../../shared/ui/SelectField';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TransactionForm = ({ onSaved }: { onSaved: () => void }) => {
  const { values, setField, submit, isSaving, error } = useTransactionForm(onSaved);
  return (
    <form
      className="stack transaction-form"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
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
          options={categories}
          onValueChange={(value) => setField('category', value as TransactionInput['category'])}
        />
        <SelectField
          label="Ví"
          value={values.wallet}
          options={wallets}
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
      <p className="muted small">Bản FE dùng thử · Lưu trên trình duyệt này.</p>
      <Button type="submit" isLoading={isSaving}>
        Lưu giao dịch
      </Button>
    </form>
  );
};

export default TransactionForm;
