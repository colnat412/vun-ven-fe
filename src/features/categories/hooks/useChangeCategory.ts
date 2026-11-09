import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { budgetKeys } from '../../budgets/key';
import { useSession } from '../../auth/session';
import { transactionKeys } from '../../transactions/key';
import { changeCategory, type CategoryChange } from '../api/categoriesApi';
import { categoryKeys } from '../key';

export const useChangeCategory = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: categoryKeys.change,
    mutationFn: (change: CategoryChange) => changeCategory(change, session),
    invalidateKeys: [transactionKeys.book(session), budgetKeys.book(session)],
  });
};
