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
  description?: string | null;
};
const Modal = (props: ModalProps) => {
  const {
    title,
    children,
    onClose,
    description = 'Kiểm tra thông tin trước khi lưu vào sổ của bạn.',
  } = props;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="app-dialog grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-3xl p-0"
        {...(!description ? { 'aria-describedby': undefined } : {})}
      >
        <DialogHeader className="dialog-heading text-left">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-[var(--hero-muted)]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid min-h-0 min-w-0 gap-6 overflow-y-auto overscroll-contain p-[27px]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
