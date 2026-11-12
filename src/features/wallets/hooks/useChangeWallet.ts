import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { useSession } from '../../auth/session';
import { transactionKeys } from '../../transactions/key';
import { changeWallet, type WalletChange } from '../api/walletsApi';

export const useChangeWallet = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: ['wallets', 'change', session?.user.id, session?.bookId],
    mutationFn: (change: WalletChange) => changeWallet(change, session),
    invalidateKeys: [transactionKeys.book(session)],
  });
};
