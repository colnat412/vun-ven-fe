import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { transactionKeys } from '../../transactions/key';
import { copyPreviousBudget } from '../api/budgetApi';
import { budgetKeys } from '../key';

export const useCopyBudget = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: budgetKeys.copy,
    mutationFn: (month: string) => copyPreviousBudget(month, session),
    invalidateKeys: [budgetKeys.book(session), transactionKeys.book(session)],
  });
};
