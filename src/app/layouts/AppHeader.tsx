import UserAvatar from '../../features/auth/UserAvatar';
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
          label={session ? 'Xem hồ sơ' : 'Đăng nhập'}
          className={session ? 'header-account header-account--signed-in' : 'header-account'}
        >
          {session ? <UserAvatar session={session} className="size-10 text-base" /> : 'Đăng nhập'}
        </AccountAccessButton>
      </div>
    </header>
  );
};
export default AppHeader;
