import { useState } from 'react';
import type { CategoryDefinition } from '../../transactions/types';
import { useChangeCategory } from './useChangeCategory';
import { isCategoryIcon } from '../categoryIcons';

type UseCategoryFormParams = { category?: CategoryDefinition };
export const useCategoryForm = (params: UseCategoryFormParams) => {
  const { category } = params;
  const [name, setValue] = useState(category?.name ?? '');
  const [icon, setIconValue] = useState<string | null>(category?.icon ?? null);
  const [iconError, setIconError] = useState('');
  const mutation = useChangeCategory();
  const setName = (value: string) => {
    setValue(value);
    mutation.reset();
  };
  const setIcon = (value: string | null) => {
    setIconValue(value);
    setIconError('');
    mutation.reset();
  };
  const submit = async (): Promise<boolean> => {
    if (!name.trim() || mutation.isPending) return false;
    if (!isCategoryIcon(icon)) {
      setIconError('Hãy chọn một biểu tượng hoặc nhập đúng một emoji.');
      return false;
    }
    try {
      await mutation.mutateAsync({ action: 'save', name: name.trim(), icon, id: category?.id });
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
    icon,
    setIcon,
    iconError,
    submit,
    remove,
    isSaving: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
