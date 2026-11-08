import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';

export type BaseMutationParams<TData, TVariables, TOnMutateResult = unknown> = UseMutationOptions<
  TData,
  Error,
  TVariables,
  TOnMutateResult
> &
  Required<
    Pick<
      UseMutationOptions<TData, Error, TVariables, TOnMutateResult>,
      'mutationKey' | 'mutationFn'
    >
  > & {
    invalidateKeys?: readonly QueryKey[];
  };

export const useBaseMutation = <TData, TVariables = void, TOnMutateResult = unknown>(
  params: BaseMutationParams<TData, TVariables, TOnMutateResult>,
) => {
  const client = useQueryClient();
  const { invalidateKeys = [], onSuccess, ...options } = params;

  return useMutation({
    retry: false,
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all(invalidateKeys.map((queryKey) => client.invalidateQueries({ queryKey })));
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
