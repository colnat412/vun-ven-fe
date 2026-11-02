import { Link, Outlet, useLocation } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BrandMark from '../../shared/ui/BrandMark';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className={`app-shell ${pathname === '/' ? 'app-shell--home' : ''}`}>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="app-header">
        <Link to="/" className="brand" aria-label="Vun Vén — Trang chủ">
          <BrandMark className="brand-mark" size={39} />
          <span>Vun Vén</span>
        </Link>
        <div className="header-actions">
          <Badge variant="outline" className="demo-badge">
            <ShieldCheck size={13} />
            Bản dùng thử
          </Badge>
        </div>
      </header>
      <main id="main-content" className="app-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
