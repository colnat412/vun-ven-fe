import { Camera } from 'lucide-react';
import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { apiClient } from '@/lib/apiClient';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSession } from '../../auth/session';
import { cn } from '@/lib/utils';

const TransactionPhoto = ({
  id,
  thumbnail = false,
  className,
}: {
  id: string;
  thumbnail?: boolean;
  className?: string;
}) => {
  const session = useSession();
  const photo = useBaseQuery({
    queryKey: ['transaction-photo', session?.user.id, session?.bookId, id],
    queryFn: () =>
      apiClient.get<{ photoDataUrl?: string; url?: string; expiresAt?: string }>(
        `/books/${encodeURIComponent(session!.bookId)}/transactions/${encodeURIComponent(id)}/photo`,
        { accessToken: session!.accessToken },
      ),
    enabled: !!session?.bookId,
    staleTime: 240_000,
    refetchInterval: 240_000,
  });
  const source = photo.data?.url ?? photo.data?.photoDataUrl;
  if (thumbnail)
    return source ? (
      <img
        src={source}
        alt=""
        className={cn('size-11 rounded-xl object-cover', className)}
        loading="lazy"
      />
    ) : (
      <Camera size={20} aria-hidden="true" />
    );
  if (photo.isPending)
    return (
      <p role="status" className="small muted">
        Đang tải ảnh…
      </p>
    );
  if (photo.error || !source)
    return (
      <div className="stack">
        <p role="alert" className="field-error">
          {GENERIC_API_ERROR_MESSAGE}
        </p>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            void photo.refetch();
          }}
        >
          Tải lại ảnh
        </button>
      </div>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="grid w-full gap-2 text-left">
          <img
            src={source}
            alt="Ảnh đính kèm giao dịch"
            className="max-h-48 w-full rounded-xl bg-muted object-contain"
          />
          <span className="small text-primary">Xem ảnh đầy đủ</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogTitle>Ảnh giao dịch</DialogTitle>
        <img src={source} alt="Ảnh giao dịch đầy đủ" className="w-full rounded-xl" />
      </DialogContent>
    </Dialog>
  );
};
export default TransactionPhoto;
