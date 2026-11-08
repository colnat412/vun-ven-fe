import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { createTransaction } from '../api/bookApi';
import { transactionKeys } from '../key';
import type { TransactionInput } from '../types';

export const useCreateTransaction = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: transactionKeys.create,
    mutationFn: (input: TransactionInput) => createTransaction(input, session),
    invalidateKeys: [transactionKeys.book(session)],
  });
};
