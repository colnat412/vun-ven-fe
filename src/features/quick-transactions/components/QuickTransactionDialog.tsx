import { useId, useRef, useState, type FormEvent } from 'react';
import Button from '@/base/ui/Button';
import Modal from '@/base/ui/Modal';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '../../auth/session';
import { QuickSaveUncertainError } from '../api/quickTransactionApi';
import { useQuickTransaction } from '../hooks/useQuickTransaction';

type QuickTransactionDialogProps = {
  onClose: () => void;
  onSaved: () => void;
};

const QuickTransactionDialog = ({ onClose, onSaved }: QuickTransactionDialogProps) => {
  const session = useSession();
  const mutation = useQuickTransaction();
  const [text, setText] = useState('');
  const submitting = useRef(false);
  const id = useId();
  const uncertain = mutation.error instanceof QuickSaveUncertainError;
  const canUseAi = !!session?.bookId;
  const message =
    mutation.error?.message ??
    (mutation.data?.status === 'needs_input' ? mutation.data.message : undefined);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current || uncertain || !canUseAi || !text.trim()) return;
    submitting.current = true;
    try {
      const result = await mutation.mutateAsync(text);
      if (result.status === 'saved') onSaved();
    } catch {
      // The mutation exposes a localized error below the input.
    } finally {
      submitting.current = false;
    }
  };

  return (
    <Modal
      title="Ghi nhanh"
      description={null}
      onClose={() => {
        if (!submitting.current) onClose();
      }}
    >
      <form
        className="stack"
        onSubmit={(event) => {
          void submit(event);
        }}
        aria-busy={mutation.isPending}
      >
        <Field className="field gap-2">
          <FieldLabel htmlFor={id}>Bạn vừa thu hoặc chi khoản gì?</FieldLabel>
          <div className="relative">
            <Textarea
              id={id}
              autoFocus
              rows={4}
              maxLength={500}
              value={text}
              disabled={!canUseAi || mutation.isPending || uncertain}
              placeholder="Ví dụ: Chuyển khoản tiền cơm 30k"
              className="min-h-28 resize-y rounded-xl bg-[var(--surface-input)] pb-9 text-base"
              aria-describedby={`${id}-help ${id}-count ${id}-message`}
              onChange={(event) => {
                setText(event.target.value);
                mutation.reset();
              }}
            />
            <span
              id={`${id}-count`}
              className="muted pointer-events-none absolute right-4 bottom-3 text-xs tabular-nums"
              aria-label={`${text.length} trên 500 ký tự`}
            >
              {text.length}/500
            </span>
          </div>
          <p id={`${id}-help`} className="muted text-sm">
            Mỗi lần ghi một khoản chi.
          </p>
        </Field>
        <div
          id={`${id}-message`}
          role="status"
          aria-live="polite"
          className="min-w-0 max-w-full overflow-hidden text-sm [&>p]:truncate"
        >
          {!canUseAi && (
            <p className="muted">
              {session
                ? 'Hãy chọn hoặc tạo sổ trong Cài đặt để dùng Ghi nhanh.'
                : 'Đăng nhập để dùng Ghi nhanh bằng AI. Bạn vẫn có thể ghi thủ công trên thiết bị này.'}
            </p>
          )}
          {message && (
            <p className="field-error" title={message}>
              {message}
            </p>
          )}
          {mutation.isPending && (
            <p className="muted" title="Đang xử lý giao dịch…">
              Đang xử lý giao dịch…
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={!canUseAi || !text.trim() || uncertain}
          >
            Lưu
          </Button>
          <Button variant="ghost" disabled={mutation.isPending} onClick={onClose}>
            Đóng
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickTransactionDialog;
