import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { setSession, useSession } from '../../auth/session';
import { createAccountBook } from '../api/booksApi';
import { bookKeys } from '../key';
import type { CreateBookInput } from '../types';
export const useCreateBook = () => {
  const session = useSession();
  return useBaseMutation({
    mutationKey: bookKeys.create,
    mutationFn: (input: CreateBookInput) => {
      if (!session) throw new Error('Vui lòng đăng nhập.');
      return createAccountBook(input, session);
    },
    onSuccess: (book) => {
      if (session) setSession({ ...session, bookId: book.id });
    },
  });
};
