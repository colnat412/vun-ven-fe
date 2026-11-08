import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import AppIcon from '../../base/ui/AppIcon';

const items = [
  { to: '/', label: 'Trang chủ', icon: 'home' },
  { to: '/transactions', label: 'Giao dịch', icon: 'time-past' },
  { to: '/reports', label: 'Thống kê', icon: 'stats' },
  { to: '/settings', label: 'Cài đặt', icon: 'settings' },
] as const;
const BottomNavigation = () => {
  const { pathname } = useLocation();
  return (
    <>
      <div className="navigation-dock">
        <NavigationMenu
          className="bottom-nav max-w-none min-[1000px]:flex-none"
          viewport={false}
          aria-label="Điều hướng chính"
        >
          <NavigationMenuList className="bottom-nav-list gap-0 p-0">
            {items.map((item) => {
              const isActive = pathname === item.to;
              return (
                <NavigationMenuItem
                  key={item.to}
                  className="bottom-nav-item"
                  data-active={isActive || undefined}
                >
                  <NavigationMenuLink
                    asChild
                    active={isActive}
                    className={cn('nav-item rounded-full', isActive && 'nav-item--active')}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <span className="nav-icon">
                        {item.icon === 'settings' ? (
                          <Settings size={20} strokeWidth={1.8} aria-hidden="true" />
                        ) : (
                          <AppIcon name={item.icon} size={20} />
                        )}
                      </span>
                      <span className="nav-label" aria-hidden="true">
                        {item.label}
                      </span>
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <NavLink
          to="/scan"
          className={({ isActive }) => cn('nav-qr', isActive && 'nav-qr--active')}
          aria-label="Quét QR"
          title="Quét QR"
        >
          <AppIcon name="qr-scan" size={25} />
          <span className="nav-qr-label">Quét QR</span>
        </NavLink>
      </div>
    </>
  );
};
export default BottomNavigation;
