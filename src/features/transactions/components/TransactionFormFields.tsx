import { useState, type FormEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '../../../base/ui/Button';
import DatePicker from '../../../base/ui/DatePicker';
import Input from '../../../base/ui/Input';
import MoneyInput from '../../../base/ui/MoneyInput';
import SelectField from '../../../base/ui/SelectField';
import CategoryIcon from './CategoryIcon';
import PaymentMethodIcon from '../../wallets/components/PaymentMethodIcon';
import { walletSearchKeywords } from '../../wallets/walletIcons';
import useTransactionForm from '../hooks/useTransactionForm';
import type { Transaction, TransactionInput } from '../types';
import { currentTime, dateKey, hasTime } from '../../../base/utils/date';
import useUnsavedChanges from '@/base/hooks/useUnsavedChanges';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import DeleteTransactionDialog from './DeleteTransactionDialog';

type TransactionFormFieldsProps = {
  onSaved: () => void;
  transaction?: Transaction;
  categoryOptions: TransactionInput['category'][];
  walletOptions: string[];
  initialDate?: string;
};
const TransactionFormFields = (props: TransactionFormFieldsProps) => {
  const { onSaved, categoryOptions, walletOptions, transaction, initialDate } = props;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { values, setField, submit, isSaving, error, validationError } = useTransactionForm({
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
  const [initialValues] = useState(values);
  const guard = useUnsavedChanges(
    JSON.stringify(values) !== JSON.stringify(initialValues),
    isSaving,
  );
  const done = () => {
    guard.allowNavigation();
    onSaved();
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await submit()) done();
  };
  return (
    <div className="stack">
      {guard.confirmation}
      <form className="stack transaction-form" onSubmit={handleSubmit}>
        <fieldset disabled={isSaving} className="stack min-w-0">
          <Tabs
            value={values.type}
            onValueChange={(value) => setField('type', value as TransactionInput['type'])}
          >
            <TabsList className="w-full">
              <TabsTrigger value="expense">
                <ArrowUpRight size={16} aria-hidden="true" />
                Tiền ra
              </TabsTrigger>
              <TabsTrigger value="income">
                <ArrowDownLeft size={16} aria-hidden="true" />
                Tiền vào
              </TabsTrigger>
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
              options={categoryOptions.map((category) => ({
                value: category,
                label: category,
                icon: <CategoryIcon category={category} />,
              }))}
              onValueChange={(value) => setField('category', value as TransactionInput['category'])}
            />
            <SelectField
              label={values.type === 'expense' ? 'Thanh toán bằng' : 'Nhận tiền vào'}
              searchable
              value={values.wallet}
              options={walletOptions.map((name) => ({
                value: name,
                label: name,
                keywords: walletSearchKeywords(name),
                icon: <PaymentMethodIcon name={name} size={24} />,
              }))}
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
          {/* <FieldDescription className="small muted">Giờ Việt Nam (UTC+7)</FieldDescription> */}
        </fieldset>
        {error && (
          <FieldError className="field-error">
            {validationError || GENERIC_API_ERROR_MESSAGE}
          </FieldError>
        )}
        <Button type="submit" isLoading={isSaving}>
          {transaction ? 'Lưu thay đổi' : 'Lưu giao dịch'}
        </Button>
        {transaction && (
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            disabled={isSaving}
            onClick={() => setConfirmDelete(true)}
          >
            Xóa giao dịch
          </Button>
        )}
      </form>
      {transaction && confirmDelete && (
        <DeleteTransactionDialog
          transaction={transaction}
          onClose={() => setConfirmDelete(false)}
          onDeleted={done}
        />
      )}
    </div>
  );
};
export default TransactionFormFields;
