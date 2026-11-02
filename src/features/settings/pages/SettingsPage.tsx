import { useState } from 'react';
import { Download, Moon, Database, ShieldCheck, ChevronRight, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import useTheme from '../hooks/useTheme';
import BrandMark from '../../../shared/ui/BrandMark';
import Button from '../../../shared/ui/Button';
import { exportBook } from '../../transactions/api/bookApi';

const SettingsPage = () => {
  const [message, setMessage] = useState('');
  const { theme, setTheme, error: themeError } = useTheme();
  const download = () => {
    try {
      const url = URL.createObjectURL(new Blob([exportBook()], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vun-ven-du-lieu.json';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Đã tạo file xuất dữ liệu. Hãy kiểm tra thư mục tải xuống.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Không xuất được dữ liệu.');
    }
  };
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Cài đặt</h1>
      </div>
      <Card>
        <CardContent>
          <Item className="flex-nowrap border-0 p-0">
            <ItemMedia>
              <BrandMark size={48} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Vun Vén</ItemTitle>
              <ItemDescription>Sổ cá nhân</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">Dùng thử</Badge>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Chế độ giao diện">
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              <Sun size={18} aria-hidden="true" /> Sáng
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              <Moon size={18} aria-hidden="true" /> Tối
            </Button>
          </div>
          {themeError && <FieldError className="mt-3">{themeError}</FieldError>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu & quyền riêng tư</CardTitle>
        </CardHeader>
        <CardContent>
          <Item className="items-start border-0 px-0 pt-0">
            <ItemMedia>
              <Database size={20} className="text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Lưu trên thiết bị</ItemTitle>
              <ItemDescription>
                Chưa có server và đồng bộ đa thiết bị. Xóa dữ liệu trình duyệt sẽ xóa dữ liệu đã
                nhập.
              </ItemDescription>
            </ItemContent>
          </Item>
          <Button variant="ghost" className="setting-row export-button" onClick={download}>
            <Download size={20} />
            <span>Xuất dữ liệu JSON</span>
            <ChevronRight size={17} />
          </Button>
        </CardContent>
      </Card>
      <Alert role="note" className="rounded-2xl bg-accent/40">
        <ShieldCheck />
        <AlertDescription>
          Vun Vén không yêu cầu mật khẩu, OTP hoặc quyền truy cập tài khoản ngân hàng.
        </AlertDescription>
      </Alert>
      {message && (
        <Alert role="status" className="rounded-2xl">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <p className="demo-note">
        Vun Vén · Frontend preview 0.1
        <br />
        React · shadcn/ui · TanStack Query
      </p>
    </div>
  );
};
export default SettingsPage;
