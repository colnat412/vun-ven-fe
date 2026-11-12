import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, ImagePlus, PenLine, QrCode, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import Button from '@/base/ui/Button';
import PageState from '@/base/ui/PageState';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button as UiButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';
import { parsePhoto, type PhotoDraft } from '../api/photoTransactionApi';
import { preparePhoto } from '../utils/preparePhoto';
import PhotoReviewForm from '../components/PhotoReviewForm';

const PhotoCapturePage = () => {
  const session = useSession();
  const book = useBook();
  const navigate = useNavigate();
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [photo, setPhoto] = useState('');
  const [draft, setDraft] = useState<PhotoDraft | null>(null);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => () => abort.current?.abort(), []);

  const readPhoto = async (data: string) => {
    if (!session?.bookId) return;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setReading(true);
    setError('');
    setDraft(null);
    try {
      setDraft(await parsePhoto(data, session, controller.signal));
    } catch {
      if (!controller.signal.aborted) setError(GENERIC_API_ERROR_MESSAGE);
    } finally {
      if (!controller.signal.aborted) {
        setReading(false);
        setRevision((previous) => previous + 1);
      }
    }
  };

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || reading || saving) return;
    setError('');
    setReading(true);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const data = await preparePhoto(file);
      if (controller.signal.aborted) return;
      setPhoto(data);
      await readPhoto(data);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setReading(false);
        setError(cause instanceof Error ? cause.message : GENERIC_API_ERROR_MESSAGE);
      }
    }
  };

  if (!session)
    return (
      <div className="page-narrow stack-lg">
        <h1>Ghi bằng ảnh</h1>
        <p className="muted">Đăng nhập để đọc ảnh và lưu ảnh cùng giao dịch của bạn.</p>
        <Link className="text-link" to="/login" state={{ from: '/capture' }}>
          Đăng nhập
        </Link>
        <Link className="text-link" to="/transactions">
          Tiếp tục nhập tay
        </Link>
      </div>
    );
  if (!session.bookId)
    return (
      <div className="page-narrow stack">
        <h1>Ghi bằng ảnh</h1>
        <p>Hãy chọn hoặc tạo sổ trước khi ghi giao dịch.</p>
        <Link className="text-link" to="/settings">
          Mở Cài đặt
        </Link>
      </div>
    );
  if (book.isPending) return <PageState kind="loading" message="Đang mở sổ…" />;
  if (book.error)
    return (
      <PageState
        kind="error"
        message={GENERIC_API_ERROR_MESSAGE}
        onRetry={() => {
          void book.refetch();
        }}
      />
    );
  if (!book.data?.categoryOptions?.length || !book.data.walletOptions?.length)
    return (
      <div className="page-narrow stack">
        <h1>Ghi bằng ảnh</h1>
        <p>Hãy thêm danh mục và ví trong sổ để tiếp tục.</p>
        <Link className="text-link" to="/settings">
          Mở Cài đặt
        </Link>
      </div>
    );

  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Ghi bằng ảnh</h1>
        <p className="muted">Một ảnh, một khoản thu chi. Kiểm tra thông tin trước khi lưu.</p>
      </div>
      <input
        ref={cameraInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        aria-label="Chụp ảnh giao dịch"
        onChange={(event) => {
          void choose(event);
        }}
        disabled={reading || saving}
      />
      <input
        ref={libraryInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Chọn ảnh giao dịch"
        onChange={(event) => {
          void choose(event);
        }}
        disabled={reading || saving}
      />
      <Card>
        <CardContent className="stack">
          {photo ? (
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" aria-label="Xem ảnh đầy đủ">
                  <img
                    src={photo}
                    alt="Ảnh giao dịch đang kiểm tra"
                    className="max-h-64 w-full rounded-xl bg-muted object-contain"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[90dvh] overflow-y-auto">
                <DialogTitle>Ảnh giao dịch</DialogTitle>
                <img src={photo} alt="Ảnh giao dịch đầy đủ" className="w-full rounded-xl" />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-input bg-primary/5 px-5 py-10 text-center">
              <Camera size={40} className="text-primary" aria-hidden="true" />
              <p>Chụp hóa đơn, biên lai hoặc khoản bạn vừa chi.</p>
              <p className="small muted">Ảnh không có giá? Bạn chỉ cần bổ sung số tiền.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button disabled={reading || saving} onClick={() => cameraInput.current?.click()}>
              <Camera size={18} aria-hidden="true" />
              {photo ? 'Chụp lại' : 'Chụp ảnh'}
            </Button>
            <Button
              variant="secondary"
              disabled={reading || saving}
              onClick={() => libraryInput.current?.click()}
            >
              <ImagePlus size={18} aria-hidden="true" />
              Chọn ảnh
            </Button>
          </div>
          {reading && (
            <p role="status" className="small muted">
              Đang đọc ảnh…
            </p>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          {photo && error && !reading && (
            <Button
              variant="ghost"
              disabled={saving}
              onClick={() => {
                void readPhoto(photo);
              }}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Đọc lại ảnh
            </Button>
          )}
        </CardContent>
      </Card>
      {photo && !reading && (
        <Card>
          <CardContent className="stack">
            <h2>Kiểm tra giao dịch</h2>
            <p className="small muted">
              Số tiền, loại giao dịch và danh mục đều có thể sửa trước khi lưu.
            </p>
            <PhotoReviewForm
              key={revision}
              photo={photo}
              draft={draft}
              book={book.data}
              onBusyChange={setSaving}
              onSaved={() => navigate('/transactions')}
            />
          </CardContent>
        </Card>
      )}
      <nav aria-label="Cách ghi khác" className="grid grid-cols-2 gap-3">
        {!photo && (
          <UiButton
            asChild
            variant="outline"
            className="h-auto min-h-14 gap-2 rounded-2xl border-border bg-card px-3 py-4 text-sm hover:bg-accent"
          >
            <Link to="/transactions">
              <PenLine size={18} className="shrink-0 text-primary" aria-hidden="true" />
              Nhập tay
            </Link>
          </UiButton>
        )}
        <UiButton
          asChild
          variant="outline"
          className={`h-auto min-h-14 gap-2 rounded-2xl border-border bg-card px-3 py-4 text-sm hover:bg-accent ${photo ? 'col-span-2' : ''}`}
        >
          <Link to="/scan">
            <QrCode size={18} className="shrink-0 text-primary" aria-hidden="true" />
            Quét mã QR
          </Link>
        </UiButton>
      </nav>
    </div>
  );
};
export default PhotoCapturePage;
