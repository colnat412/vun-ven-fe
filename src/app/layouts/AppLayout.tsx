import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { Suspense } from 'react';
import PageState from '@/base/ui/PageState';
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
        <Suspense fallback={<PageState kind="loading" message="Đang mở màn hình…" />}>
          <Outlet key={(session?.user.id ?? 'guest') + (session?.bookId ?? '')} />
        </Suspense>
      </main>
      <BottomNavigation />
      <ScrollRestoration />
    </div>
  );
};
export default AppLayout;
