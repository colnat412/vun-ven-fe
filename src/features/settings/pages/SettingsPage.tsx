import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import { Moon, Sun } from 'lucide-react';
import AccountSettings from '../../auth/AccountSettings';
import useTheme from '../hooks/useTheme';
import CategorySettings from '../../categories/components/CategorySettings';

const SettingsPage = () => {
  const { theme, setTheme, error: themeError } = useTheme();
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Cài đặt</h1>
      </div>
      <AccountSettings />
      <CategorySettings />
      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="theme-setting">
            <div className="theme-setting-label">
              <Moon size={20} aria-hidden="true" />
              <label htmlFor="dark-mode-toggle">Chế độ tối</label>
            </div>
            <button
              id="dark-mode-toggle"
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Chế độ tối"
              className="theme-switch"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="theme-switch-track" aria-hidden="true">
                <span className="theme-switch-thumb">
                  {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
                </span>
              </span>
            </button>
          </div>
          {themeError && <FieldError className="mt-3">{themeError}</FieldError>}
        </CardContent>
      </Card>
    </div>
  );
};
export default SettingsPage;
