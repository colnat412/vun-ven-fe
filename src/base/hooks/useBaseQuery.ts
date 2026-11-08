import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';

export type BaseQueryParams<
  TQueryData,
  TData = TQueryData,
  TKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryData, Error, TData, TKey> &
  Required<Pick<UseQueryOptions<TQueryData, Error, TData, TKey>, 'queryKey' | 'queryFn'>>;

export const useBaseQuery = <TQueryData, TData = TQueryData, TKey extends QueryKey = QueryKey>(
  params: BaseQueryParams<TQueryData, TData, TKey>,
) => useQuery({ retry: false, ...params });
