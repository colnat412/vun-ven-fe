import { Alert, AlertDescription } from '@/components/ui/alert';
import { RotateCcw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import Button from '../../../base/ui/Button';
import PageHeader from '@/base/ui/PageHeader';
import usePageReturn from '@/base/hooks/usePageReturn';
import QrResultCard from '../components/QrResultCard';
import ScanImageUpload from '../components/ScanImageUpload';
import ScannerPreview from '../components/ScannerPreview';
import useQrImage from '../hooks/useQrImage';
import useQrScanner from '../hooks/useQrScanner';

const ScanPage = () => {
  const { videoRef, result, error, isStarting, restart } = useQrScanner();
  const navigate = useNavigate();
  const back = usePageReturn('/');
  const location = useLocation();
  const openForm = () =>
    navigate('/transactions/new', { state: { returnTo: location.pathname + location.search } });
  const { imageResult, imageNote, isReading, readImage, resetImage } = useQrImage();
  const qrResult = imageResult || result;
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <PageHeader title="Quét QR" onBack={back} />
        <p className="muted">Đưa mã QR vào khung để đọc thông tin.</p>
      </div>
      <ScannerPreview videoRef={videoRef} result={qrResult} error={error} isStarting={isStarting} />
      {error && (
        <Alert role="status" className="rounded-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <ScanImageUpload isReading={isReading} onReadImage={readImage} />
      {imageNote && (
        <Alert role="status" className="rounded-2xl">
          <AlertDescription>{imageNote}</AlertDescription>
        </Alert>
      )}
      {qrResult && <QrResultCard result={qrResult} onCreateTransaction={openForm} />}
      <div className="row">
        <Button
          variant="ghost"
          onClick={() => {
            resetImage();
            restart();
          }}
        >
          <RotateCcw size={16} />
          Quét lại
        </Button>
        {!qrResult && (
          <Button variant="ghost" onClick={openForm}>
            Nhập tay
          </Button>
        )}
      </div>
    </div>
  );
};
export default ScanPage;
