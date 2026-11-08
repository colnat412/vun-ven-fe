import type { FormEvent } from 'react';
import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router';
import useLoginForm from '../hooks/useLoginForm';

type LoginFormProps = {
  destination: string;
};
const LoginForm = (props: LoginFormProps) => {
  const { destination } = props;
  const navigate = useNavigate();
  const {
    mode,
    email,
    password,
    displayName,
    setEmail,
    setPassword,
    setDisplayName,
    changeMode,
    submit,
    busy,
    error,
  } = useLoginForm();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await submit()) navigate(destination, { replace: true });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</CardTitle>
      </CardHeader>
      <CardContent className="stack">
        <div className="flex gap-3" role="group" aria-label="Tài khoản">
          <Button
            className="flex-1"
            disabled={busy}
            variant={mode === 'login' ? 'primary' : 'secondary'}
            onClick={() => {
              changeMode('login');
            }}
          >
            Đăng nhập
          </Button>
          <Button
            className="flex-1"
            disabled={busy}
            variant={mode === 'register' ? 'primary' : 'secondary'}
            onClick={() => {
              changeMode('register');
            }}
          >
            Đăng ký
          </Button>
        </div>
        <form className="stack" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              label="Tên hiển thị"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
              maxLength={120}
              disabled={busy}
              autoComplete="name"
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            autoComplete="username"
            disabled={busy}
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={mode === 'register' ? 12 : undefined}
            maxLength={128}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            disabled={busy}
          />
          {mode === 'register' && <p className="small muted">Mật khẩu cần ít nhất 12 ký tự.</p>}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <Button type="submit" isLoading={busy}>
            {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default LoginForm;
