import { useSyncExternalStore } from 'react';
import { Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import AppIcon from '../../shared/ui/AppIcon';

const items = [
  { to: '/', label: 'Trang chủ', icon: 'home' },
  { to: '/transactions', label: 'Giao dịch', icon: 'time-past' },
  { to: '/scan', label: 'Quét QR', icon: 'qr-scan' },
  { to: '/reports', label: 'Thống kê', icon: 'stats' },
  { to: '/settings', label: 'Cài đặt', icon: 'settings' },
] as const;
const desktopQuery = '(min-width: 1000px)';
const subscribeLayout = (listener: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
};
const isDesktopLayout = () => window.matchMedia(desktopQuery).matches;
const BottomNavigation = () => {
  const isDesktop = useSyncExternalStore(subscribeLayout, isDesktopLayout);
  const { pathname } = useLocation();
  return (
    <NavigationMenu
      className="bottom-nav fixed max-w-none flex-none"
      viewport={false}
      orientation={isDesktop ? 'vertical' : 'horizontal'}
      aria-label="Điều hướng chính"
    >
      <NavigationMenuList className="bottom-nav-list grid h-full w-full grid-cols-5 gap-0 p-0 min-[1000px]:flex min-[1000px]:flex-col min-[1000px]:gap-2">
        {items.map((item) => {
          const isScan = item.to === '/scan';
          const isActive = pathname === item.to;
          return (
            <NavigationMenuItem key={item.to} className="contents">
              <NavigationMenuLink
                asChild
                active={isActive}
                className={cn(
                  'nav-item',
                  isActive && 'nav-item--active',
                  isScan && 'nav-item--scan',
                )}
              >
                <NavLink to={item.to} end={item.to === '/'} aria-label={item.label}>
                  <span className={isScan ? 'qr-orb' : 'nav-icon'}>
                    {item.icon === 'settings' ? (
                      <Settings size={23} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <AppIcon name={item.icon} size={isScan ? 25 : 23} />
                    )}
                  </span>
                  {!isScan && <span>{item.label}</span>}
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default BottomNavigation;
