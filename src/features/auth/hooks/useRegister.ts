import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { registerAccount } from '../api/authApi';
import { authKeys } from '../key';
export const useRegister = () =>
  useBaseMutation({ mutationKey: authKeys.register, mutationFn: registerAccount });
