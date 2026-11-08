import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router';
import Button from '../../base/ui/Button';

type LoginPromptProps = {
  open: boolean;
  onClose: () => void;
  destination?: string;
};
const LoginPrompt = (props: LoginPromptProps) => {
  const { open, onClose, destination = '/settings' } = props;
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="rounded-3xl p-6">
        <DialogHeader className="text-left">
          <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription>Bạn cần đăng nhập để sử dụng sổ tài khoản.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Để sau
          </Button>
          <Button
            onClick={() => {
              onClose();
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
