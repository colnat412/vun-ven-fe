import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { useSession } from '../../auth/session';
import { getBook } from '../api/bookApi';
import { transactionKeys } from '../key';

export const useBook = () => {
  const session = useSession();
  return useBaseQuery({
    queryKey: transactionKeys.book(session),
    // Let this cached read finish across transient unmounts (including StrictMode).
    // A remount can then share the in-flight request instead of aborting and restarting it.
    queryFn: () => getBook(session),
    staleTime: 30_000,
  });
};
