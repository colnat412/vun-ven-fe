import { UserRound } from 'lucide-react';
import { Link } from 'react-router';
import BrandMark from '../../base/ui/BrandMark';
import AccountAccessButton from '../../features/auth/AccountAccessButton';
import { useSession } from '../../features/auth/session';

const AppHeader = () => {
  const session = useSession();
  return (
    <header className="app-header">
      <Link to="/" className="brand" aria-label="Vun Vén — Trang chủ">
        <BrandMark className="brand-mark" size={39} />
        <span>Vun Vén</span>
      </Link>
      <div className="header-actions">
        <AccountAccessButton
          label={session ? 'Sổ tài khoản' : 'Đăng nhập'}
          className={session ? 'header-account header-account--signed-in' : 'header-account'}
        >
          {session ? <UserRound size={21} aria-hidden="true" /> : 'Đăng nhập'}
        </AccountAccessButton>
      </div>
    </header>
  );
};
export default AppHeader;
