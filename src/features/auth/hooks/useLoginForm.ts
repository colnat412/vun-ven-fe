import { useState } from 'react';
import type { AuthMode } from '../types';
import { useLogin } from './useLogin';
import { useRegister } from './useRegister';
const useLoginForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const login = useLogin();
  const register = useRegister();
  const changeMode = (next: AuthMode) => {
    setMode(next);
    login.reset();
    register.reset();
  };
  const submit = async (): Promise<boolean> => {
    try {
      if (mode === 'register') {
        await register.mutateAsync({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        });
        setMode('login');
      }
      await login.mutateAsync({ email: email.trim(), password });
      setPassword('');
      return true;
    } catch {
      return false;
    }
  };
  return {
    mode,
    email,
    password,
    displayName,
    setEmail,
    setPassword,
    setDisplayName,
    changeMode,
    submit,
    busy: login.isPending || register.isPending,
    error: register.error?.message || login.error?.message,
  };
};
export default useLoginForm;
