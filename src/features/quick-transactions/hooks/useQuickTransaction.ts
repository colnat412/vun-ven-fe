import { useQueryClient } from '@tanstack/react-query';
import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { budgetKeys } from '../../budgets/key';
import { transactionKeys } from '../../transactions/key';
import { createQuickTransaction, QuickSaveUncertainError } from '../api/quickTransactionApi';

export const useQuickTransaction = () => {
  const session = useSession();
  const client = useQueryClient();
  return useBaseMutation({
    mutationKey: ['transactions', 'quick-create', session?.user.id, session?.bookId],
    mutationFn: ({ text, walletId }: { text: string; walletId?: string }) =>
      createQuickTransaction(text, session, walletId),
    onSettled: async (result, error) => {
      if (result?.status === 'saved' || error instanceof QuickSaveUncertainError) {
        await Promise.all([
          client.invalidateQueries({ queryKey: transactionKeys.book(session) }),
          client.invalidateQueries({ queryKey: budgetKeys.book(session) }),
        ]);
      }
    },
  });
};
