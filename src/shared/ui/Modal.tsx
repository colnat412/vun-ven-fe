import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalProps = { title: string; children: ReactNode; onClose: () => void };

const Modal = ({ title, children, onClose }: ModalProps) => (
  <Dialog
    open
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent className="app-dialog">
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

export default Modal;
