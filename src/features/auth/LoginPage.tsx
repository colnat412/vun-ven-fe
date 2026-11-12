import { Link, useLocation } from 'react-router';
import BrandMark from '../../base/ui/BrandMark';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  const location = useLocation();
  const destination = [
    '/settings',
    '/account',
    '/transactions',
    '/reports',
    '/capture',
    '/',
  ].includes(location.state?.from)
    ? location.state.from
    : '/settings';
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="brand justify-center text-primary">
          <BrandMark size={42} />
          <span>Vun Vén</span>
        </Link>
        <LoginForm destination={destination} />
        <Link className="text-link block text-center" to="/">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
};
export default LoginPage;
