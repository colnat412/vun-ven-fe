import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { useSession } from '../../auth/session';
import { getBudget } from '../api/budgetApi';
import { budgetKeys } from '../key';

export const useBudget = (month: string) => {
  const session = useSession();
  return useBaseQuery({
    queryKey: budgetKeys.month(session, month),
    // Share the in-flight read when StrictMode or tab navigation remounts this observer.
    queryFn: () => getBudget(month, session),
    staleTime: 30_000,
    enabled: !session || !!session.bookId,
  });
};
