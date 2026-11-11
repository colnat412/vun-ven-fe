import { useState, type FormEvent, type ReactNode } from 'react';
import { UserRound } from 'lucide-react';
import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { setSession, updateSessionUser, type Session } from './session';
import { updateProfile } from './api/authApi';

type ProfileDialogProps = {
  session: Session;
  children: ReactNode;
};

const ProfileDialog = ({ session, children }: ProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(session.user.displayName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const name = displayName.trim();
    setError('');
    setSaved(false);
    if (!name || name.length > 120) {
      setError('Tên hiển thị cần từ 1 đến 120 ký tự.');
      return;
    }
    setBusy(true);
    try {
      const user = await updateProfile(name, session.accessToken);
      updateSessionUser(user, session.accessToken);
      setDisplayName(user.displayName);
      setSaved(true);
    } catch {
      setError(GENERIC_API_ERROR_MESSAGE);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        if (next) {
          setDisplayName(session.user.displayName);
          setError('');
          setSaved(false);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto rounded-2xl p-6 sm:max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle>Hồ sơ cá nhân</DialogTitle>
          <DialogDescription className="sr-only">Cập nhật tên hiển thị của bạn.</DialogDescription>
        </DialogHeader>
        <form className="grid min-w-0 gap-4" onSubmit={handleSubmit}>
          <div className="mx-auto my-2 flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound size={44} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <Input
            label="Tên hiển thị"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setError('');
              setSaved(false);
            }}
            required
            maxLength={120}
            autoComplete="name"
            disabled={busy}
          />
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          {saved && (
            <p role="status" className="small text-primary">
              Đã cập nhật tên hiển thị.
            </p>
          )}
          <div className="grid gap-3">
            <Button
              type="submit"
              isLoading={busy}
              disabled={displayName.trim() === session.user.displayName}
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setSession(null);
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
