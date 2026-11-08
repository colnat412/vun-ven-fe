import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { updateTransaction } from '../api/bookApi';
import { transactionKeys } from '../key';
import type { TransactionInput } from '../types';

export const useUpdateTransaction = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: transactionKeys.update,
    mutationFn: ({ id, input }: { id: string; input: TransactionInput }) =>
      updateTransaction(id, input, session),
    invalidateKeys: [transactionKeys.book(session)],
  });
};
