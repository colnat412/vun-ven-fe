import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { updateBudget } from '../api/budgetApi';
import { transactionKeys } from '../../transactions/key';
import { budgetKeys } from '../key';

export const useUpdateBudget = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: budgetKeys.update,
    mutationFn: (input: Parameters<typeof updateBudget>[0]) => updateBudget(input, session),
    invalidateKeys: [transactionKeys.book(session), budgetKeys.book(session)],
  });
};
