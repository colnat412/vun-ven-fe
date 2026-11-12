import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
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
import { updateAvatar, updateProfile } from './api/authApi';
import UserAvatar from './UserAvatar';
import { avatarKey } from './key';
import { prepareAvatar, type AvatarCrop } from './utils/prepareAvatar';
import AvatarEditor from './AvatarEditor';

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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const locked = useRef(false);
  const queryClient = useQueryClient();

  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || locked.current) return;
    setError('');
    setSaved(false);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Hãy chọn ảnh JPG, PNG hoặc WebP.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Hãy chọn ảnh nhỏ hơn 20 MB.');
      return;
    }
    setSelectedFile(file);
  };

  const saveAvatar = async (crop: AvatarCrop) => {
    if (!selectedFile || locked.current) return;
    locked.current = true;
    setUploading(true);
    setError('');
    setSaved(false);
    try {
      let dataUrl: string;
      try {
        dataUrl = await prepareAvatar(selectedFile, crop);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Không đọc được ảnh.');
        return;
      }
      const user = await updateAvatar(dataUrl, session.accessToken);
      updateSessionUser(user, session.accessToken);
      await queryClient.invalidateQueries({ queryKey: avatarKey(session) });
      setSelectedFile(null);
      setSaved(true);
    } catch {
      setError(GENERIC_API_ERROR_MESSAGE);
    } finally {
      locked.current = false;
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current || selectedFile) return;
    const name = displayName.trim();
    setError('');
    setSaved(false);
    if (!name || name.length > 120) {
      setError('Tên hiển thị cần từ 1 đến 120 ký tự.');
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const user = await updateProfile(name, session.accessToken);
      updateSessionUser(user, session.accessToken);
      setDisplayName(user.displayName);
      setSaved(true);
    } catch {
      setError(GENERIC_API_ERROR_MESSAGE);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (locked.current) return;
        setSelectedFile(null);
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
          <DialogDescription className="sr-only">
            Cập nhật ảnh đại diện và tên hiển thị của bạn.
          </DialogDescription>
        </DialogHeader>
        <form className="grid min-w-0 gap-4" onSubmit={handleSubmit}>
          {selectedFile ? (
            <AvatarEditor
              file={selectedFile}
              busy={uploading}
              onSave={saveAvatar}
              onCancel={() => {
                setSelectedFile(null);
                setError('');
              }}
            />
          ) : (
            <>
              <div className="mx-auto my-2 grid justify-items-center gap-2">
                <button
                  type="button"
                  className="relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60"
                  aria-label="Đổi ảnh đại diện"
                  disabled={busy || uploading}
                  onClick={() => fileInput.current?.click()}
                >
                  <UserAvatar session={session} className="size-24 text-3xl" />
                  <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                    <Camera size={16} aria-hidden="true" />
                  </span>
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  aria-label="Chọn ảnh đại diện"
                  disabled={busy || uploading}
                  onChange={handleAvatar}
                />
                <span className="small text-muted-foreground" role="status">
                  {uploading ? 'Đang tải ảnh…' : 'Chạm để đổi ảnh'}
                </span>
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
                disabled={busy || uploading}
              />
            </>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          {saved && (
            <p role="status" className="small text-primary">
              Đã cập nhật hồ sơ.
            </p>
          )}
          {!selectedFile && (
            <div className="grid gap-3">
              <Button
                type="submit"
                isLoading={busy}
                disabled={uploading || displayName.trim() === session.user.displayName}
              >
                Lưu thay đổi
              </Button>
              <Button
                variant="ghost"
                disabled={busy || uploading}
                onClick={() => {
                  setOpen(false);
                  setSession(null);
                }}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
