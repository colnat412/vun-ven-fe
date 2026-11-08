import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { useSession } from '../../auth/session';
import { getBook } from '../api/bookApi';
import { transactionKeys } from '../key';

export const useBook = () => {
  const session = useSession();
  return useBaseQuery({
    queryKey: transactionKeys.book(session),
    queryFn: ({ signal }) => getBook(session, signal),
    staleTime: 30_000,
  });
};
