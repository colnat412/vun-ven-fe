import { amountError } from '@/base/utils/amountValidation';
import { currentTime, isValidDate, isValidTime, today } from '@/base/utils/date';
import { useState } from 'react';
import type { TransactionInput } from '../types';
import { useCreateTransaction } from './useCreateTransaction';
import { useUpdateTransaction } from './useUpdateTransaction';

export type UseTransactionFormParams = {
  initialValues?: Partial<TransactionInput>;
  transactionId?: string;
};
const useTransactionForm = (params: UseTransactionFormParams = {}) => {
  const [values, setValues] = useState<TransactionInput>(() => ({
    amount: '',
    note: '',
    category: 'Ăn uống',
    wallet: 'Tiền mặt',
    date: today(),
    time: currentTime(),
    type: 'expense',
    ...params.initialValues,
  }));
  const [validationError, setValidationError] = useState('');
  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const mutation = params.transactionId ? update : create;
  const setField = <K extends keyof TransactionInput>(key: K, value: TransactionInput[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setValidationError('');
    if (mutation.isError) mutation.reset();
  };
  const submit = async (): Promise<boolean> => {
    const moneyError = amountError(values.amount, 1n);
    if (moneyError) {
      setValidationError(moneyError);
      return false;
    }
    if (!isValidDate(values.date) || !isValidTime(values.time)) {
      setValidationError('Ngày hoặc giờ giao dịch không hợp lệ.');
      return false;
    }
    setValidationError('');
    try {
      if (params.transactionId)
        await update.mutateAsync({ id: params.transactionId, input: values });
      else await create.mutateAsync(values);
      return true;
    } catch {
      return false;
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
