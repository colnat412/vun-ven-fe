import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { deleteTransaction } from '../api/bookApi';
import { transactionKeys } from '../key';

export const useDeleteTransaction = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: transactionKeys.delete,
    mutationFn: (id: string) => deleteTransaction(id, session),
    invalidateKeys: [transactionKeys.book(session)],
  });
};
