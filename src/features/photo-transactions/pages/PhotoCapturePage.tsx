import { QrCode } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import PageState from '@/base/ui/PageState';
import PageHeader from '@/base/ui/PageHeader';
import usePageReturn from '@/base/hooks/usePageReturn';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { useSession } from '../../auth/session';
import { useBook } from '../../transactions/hooks/useBook';
import PhotoReviewForm from '../components/PhotoReviewForm';
import '../photo-capture.css';

const PhotoCapturePage = () => {
  const session = useSession();
  const book = useBook();
  const navigate = useNavigate();
  const location = useLocation();
  const back = usePageReturn('/transactions');

  if (!session)
    return (
      <div className="page-narrow stack-lg">
        <PageHeader title="Chụp & ghi" onBack={back} />
        <p className="muted">Lưu khoảnh khắc cùng khoản thu chi của bạn.</p>
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
        <PageHeader title="Chụp & ghi" onBack={back} />
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
        <PageHeader title="Chụp & ghi" onBack={back} />
        <p>Hãy thêm danh mục và ví trong sổ để tiếp tục.</p>
        <Link className="text-link" to="/settings">
          Mở Cài đặt
        </Link>
      </div>
    );

  return (
    <div className="photo-capture page-narrow">
      <div className="mb-[var(--space-section)]">
        <PageHeader
          title="Chụp & ghi"
          eyebrow="MỘT ẢNH, MỘT KHOẢN"
          onBack={back}
          action={
            <Link
              to="/scan"
              state={{ returnTo: location.pathname + location.search }}
              className="photo-capture__back"
              aria-label="Quét mã QR"
            >
              <QrCode size={21} />
            </Link>
          }
        />
      </div>
      <PhotoReviewForm
        book={book.data}
        onSaved={(date) => navigate('/', { state: { journalMonth: date.slice(0, 7) } })}
      />
    </div>
  );
};
export default PhotoCapturePage;
