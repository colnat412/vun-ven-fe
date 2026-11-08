import { useBaseMutation } from '@/base/hooks/useBaseMutation';
import { authenticate } from '../api/authApi';
import { authKeys } from '../key';
import { setSession } from '../session';
export const useLogin = () =>
  useBaseMutation({
    mutationKey: authKeys.login,
    mutationFn: authenticate,
    onSuccess: (session) => setSession(session),
  });
