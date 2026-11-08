import { useState } from 'react';
import type { CategoryDefinition } from '../../transactions/types';
import { useChangeCategory } from './useChangeCategory';

type UseCategoryFormParams = { category?: CategoryDefinition };
export const useCategoryForm = (params: UseCategoryFormParams) => {
  const { category } = params;
  const [name, setValue] = useState(category?.name ?? '');
  const mutation = useChangeCategory();
  const setName = (value: string) => {
    setValue(value);
    mutation.reset();
  };
  const submit = async (): Promise<boolean> => {
    if (!name.trim() || mutation.isPending) return false;
    try {
      await mutation.mutateAsync({ action: 'save', name: name.trim(), id: category?.id });
      return true;
    } catch {
      return false;
    }
  };
  const remove = async (): Promise<boolean> => {
    if (!category || mutation.isPending) return false;
    try {
      await mutation.mutateAsync({ action: 'delete', id: category.id });
      return true;
    } catch {
      return false;
    }
  };
  return {
    name,
    setName,
    submit,
    remove,
    isSaving: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
