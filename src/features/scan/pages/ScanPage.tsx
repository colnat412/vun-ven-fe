import { Alert, AlertDescription } from '@/components/ui/alert';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../base/ui/Button';
import TransactionDialog from '../../transactions/components/TransactionDialog';
import QrResultCard from '../components/QrResultCard';
import ScanImageUpload from '../components/ScanImageUpload';
import ScannerPreview from '../components/ScannerPreview';
import useQrImage from '../hooks/useQrImage';
import useQrScanner from '../hooks/useQrScanner';

const ScanPage = () => {
  const { videoRef, result, error, isStarting, restart } = useQrScanner();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { imageResult, imageNote, isReading, readImage, resetImage } = useQrImage();
  const qrResult = imageResult || result;
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Quét QR</h1>
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
      {qrResult && (
        <QrResultCard result={qrResult} onCreateTransaction={() => setIsFormOpen(true)} />
      )}
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
          <Button variant="ghost" onClick={() => setIsFormOpen(true)}>
            Nhập tay
          </Button>
        )}
      </div>
      <TransactionDialog
        open={isFormOpen}
        title="Xác nhận tiền ra"
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};
export default ScanPage;
