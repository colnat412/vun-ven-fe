import { Outlet, useLocation } from 'react-router';
import { useSession } from '../../features/auth/session';
import AppHeader from './AppHeader';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  const session = useSession();
  const { pathname } = useLocation();
  return (
    <div className={`app-shell ${pathname === '/' ? 'app-shell--home' : ''}`}>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <AppHeader />
      <main id="main-content" className="app-content">
        <Outlet key={(session?.user.id ?? 'guest') + (session?.bookId ?? '')} />
      </main>
      <BottomNavigation />
    </div>
  );
};
export default AppLayout;
