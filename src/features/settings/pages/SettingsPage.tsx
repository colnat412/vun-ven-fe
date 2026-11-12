import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import { Moon, Sun } from 'lucide-react';
import AccountSettings from '../../auth/AccountSettings';
import useTheme, { colorThemes } from '../hooks/useTheme';
import CategorySettings from '../../categories/components/CategorySettings';
import WalletSettings from '../../wallets/components/WalletSettings';

const SettingsPage = () => {
  const { theme, setTheme, colorTheme, setColorTheme, error: themeError } = useTheme();
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Cài đặt</h1>
      </div>
      <AccountSettings />
      <WalletSettings />
      <CategorySettings />
      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <fieldset className="min-w-0">
            <legend className="mb-3 text-sm font-semibold">Màu chủ đạo</legend>
            <div className="flex flex-wrap items-center gap-2">
              {colorThemes.map((color) => (
                <label
                  key={color.value}
                  title={color.label}
                  className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-transparent has-[:checked]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                >
                  <input
                    type="radio"
                    name="color-theme"
                    value={color.value}
                    aria-label={color.label}
                    checked={colorTheme === color.value}
                    onChange={() => setColorTheme(color.value)}
                    className="sr-only"
                  />
                  <span
                    className="size-8 rounded-full"
                    style={{ backgroundColor: color.swatch }}
                    aria-hidden="true"
                  />
                </label>
              ))}
            </div>
          </fieldset>
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
