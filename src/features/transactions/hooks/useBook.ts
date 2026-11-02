import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTransaction, getBook, updateBudget } from '../api/bookApi';

const bookKey = ['demo', 'personal-book'] as const;

export const useBook = () =>
  useQuery({ queryKey: bookKey, queryFn: getBook, staleTime: 30_000, retry: false });
export const useCreateTransaction = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    retry: false,
    onSuccess: (book) => {
      client.setQueryData(bookKey, book);
    },
  });
};
export const useUpdateBudget = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    retry: false,
    onSuccess: (book) => {
      client.setQueryData(bookKey, book);
    },
  });
};
