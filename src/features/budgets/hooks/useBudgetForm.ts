import { amountError } from '@/base/utils/amountValidation';
import { useState } from 'react';
import type { Category } from '../../transactions/types';
import { useUpdateBudget } from './useUpdateBudget';

export type UseBudgetFormParams = { month: string; category?: Category; initialAmount: string };
const useBudgetForm = (params: UseBudgetFormParams) => {
  const { month, category, initialAmount } = params;
  const [amount, setAmount] = useState(initialAmount);
  const [validationError, setValidationError] = useState('');
  const mutation = useUpdateBudget();
  const changeAmount = (value: string) => {
    setAmount(value);
    setValidationError('');
    if (mutation.isError) mutation.reset();
  };
  const submit = async (): Promise<boolean> => {
    const error = amountError(amount);
    setValidationError(error);
    if (error) return false;
    try {
      await mutation.mutateAsync({ month, amount, category });
      return true;
    } catch {
      return false;
    }
  };
  return {
    amount,
    changeAmount,
    submit,
    validationError,
    error: mutation.error?.message,
    isSaving: mutation.isPending,
  };
};
export default useBudgetForm;
