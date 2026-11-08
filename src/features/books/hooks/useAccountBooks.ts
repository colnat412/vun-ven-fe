import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { useSession } from '../../auth/session';
import { getAccountBooks } from '../api/booksApi';
import { bookKeys } from '../key';
export const useAccountBooks = () => {
  const session = useSession();
  return useBaseQuery({
    queryKey: bookKeys.list(session?.user.id),
    queryFn: ({ signal }) => {
      if (!session) throw new Error('Vui lòng đăng nhập.');
      return getAccountBooks(session, signal);
    },
    enabled: !!session,
  });
};
