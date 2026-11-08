import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ReactNode } from 'react';

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};
const Modal = (props: ModalProps) => {
  const { title, children, onClose } = props;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="app-dialog p-[27px]">
        <DialogHeader className="dialog-heading text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-[var(--hero-muted)]">
            Kiểm tra thông tin trước khi lưu vào sổ của bạn.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
