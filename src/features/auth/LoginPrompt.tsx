import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router';
import Button from '../../base/ui/Button';
import type { ReactElement } from 'react';

type LoginPromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactElement;
  destination?: string;
};
const LoginPrompt = (props: LoginPromptProps) => {
  const { open, onOpenChange, children, destination = '/settings' } = props;
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-3xl p-6">
        <DialogHeader className="text-left">
          <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription>Bạn cần đăng nhập để sử dụng sổ tài khoản.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Để sau
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/login', { state: { from: destination } });
            }}
          >
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LoginPrompt;
