import { useState } from 'react';
import { today, currentTime, isValidDate, isValidTime } from '../../../shared/utils/date';
import { useCreateTransaction } from './useBook';
import type { TransactionInput } from '../types';

const useTransactionForm = (onSaved: () => void) => {
  const [values, setValues] = useState<TransactionInput>(() => ({
    amount: '',
    note: '',
    category: 'Ăn uống',
    wallet: 'Tiền mặt',
    date: today(),
    time: currentTime(),
    type: 'expense',
  }));
  const [validationError, setValidationError] = useState('');
  const mutation = useCreateTransaction();
  const setField = <K extends keyof TransactionInput>(key: K, value: TransactionInput[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  const submit = async () => {
    if (
      !/^\d{1,13}$/.test(values.amount) ||
      BigInt(values.amount) <= 0n ||
      BigInt(values.amount) > 1000000000000n
    ) {
      setValidationError('Nhập số tiền nguyên từ 1 đến 1.000.000.000.000 đồng.');
      return;
    }
    if (!isValidDate(values.date) || !isValidTime(values.time)) {
      setValidationError('Ngày hoặc giờ giao dịch không hợp lệ.');
      return;
    }
    setValidationError('');
    try {
      await mutation.mutateAsync(values);
      onSaved();
    } catch {
      /* useMutation exposes the error to the form. */
    }
  };
  return {
    values,
    setField,
    submit,
    isSaving: mutation.isPending,
    error: validationError || mutation.error?.message,
  };
};

export default useTransactionForm;
