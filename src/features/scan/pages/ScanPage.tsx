import AppIcon from '../../../shared/ui/AppIcon';
import { useRef, useState } from 'react';
import { Camera, ImagePlus, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import jsQR from 'jsqr';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Button from '../../../shared/ui/Button';
import Modal from '../../../shared/ui/Modal';
import TransactionForm from '../../transactions/components/TransactionForm';
import useQrScanner from '../hooks/useQrScanner';

const ScanPage = () => {
  const { videoRef, result, error, isStarting, restart } = useQrScanner();
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [imageResult, setImageResult] = useState('');
  const [imageNote, setImageNote] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const readImage = async (file?: File) => {
    if (!file) return;
    setImageResult('');
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setImageNote('Chọn ảnh JPG, PNG hoặc WebP, tối đa 8 MB.');
      return;
    }
    setIsReading(true);
    let bitmap: ImageBitmap | undefined;
    try {
      bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Trình duyệt không xử lý được ảnh này.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(pixels.data, pixels.width, pixels.height);
      if (qr) {
        setImageResult(qr.data);
        setImageNote(`Đã đọc QR từ ${file.name}.`);
      } else
        setImageNote(
          `Đã chọn ${file.name}, chưa tìm thấy QR. Đọc hóa đơn bằng OCR sẽ được nối với backend ở bước sau; hiện bạn có thể nhập tay. Ảnh chưa được lưu hoặc gửi đi.`,
        );
    } catch {
      setImageNote(
        'Không đọc được ảnh. Thử ảnh JPG/PNG rõ nét hơn; ảnh chưa được lưu hoặc gửi đi.',
      );
    } finally {
      bitmap?.close();
      setIsReading(false);
    }
  };
  const qrResult = imageResult || result;
  return (
    <div className="page-narrow stack-lg">
      <div className="page-heading">
        <h1>Quét QR</h1>
        <p className="muted">Đưa mã QR vào khung để đọc thông tin.</p>
      </div>
      <div className="scanner">
        <video ref={videoRef} muted playsInline aria-label="Camera quét mã QR" />
        <div className="scanner-shade" />
        <div className="scanner-frame">
          <i />
          <i />
          <i />
          <i />
          {!qrResult && <AppIcon name="qr-scan" size={52} />}
          {qrResult && <Check size={48} />}
        </div>
        <p className="scanner-caption">
          {qrResult
            ? 'Đã tìm thấy mã QR'
            : error
              ? 'Camera chưa sẵn sàng'
              : isStarting
                ? 'Đang mở camera…'
                : 'Giữ mã QR trong khung hình'}
        </p>
      </div>
      {error && (
        <Alert role="status" className="rounded-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="scan-options">
        <Button variant="secondary" onClick={() => uploadRef.current?.click()} disabled={isReading}>
          <ImagePlus size={20} />
          {isReading ? 'Đang đọc ảnh…' : 'Tải ảnh lên'}
        </Button>
        <Button variant="secondary" onClick={() => cameraRef.current?.click()} disabled={isReading}>
          <Camera size={20} />
          Chụp ảnh hóa đơn
        </Button>
      </div>
      <input
        ref={uploadRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Tải ảnh QR hoặc hóa đơn"
        onChange={(event) => {
          void readImage(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <input
        ref={cameraRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        aria-label="Chụp ảnh hóa đơn"
        onChange={(event) => {
          void readImage(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {imageNote && (
        <Alert role="status" className="rounded-2xl">
          <AlertDescription>{imageNote}</AlertDescription>
        </Alert>
      )}
      {qrResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin đã đọc</CardTitle>
            <AppIcon name="qr-scan" size={20} />
          </CardHeader>
          <CardContent className="stack">
            <CardDescription className="small">
              Nội dung chưa được xác minh với ngân hàng. Vun Vén chưa thực hiện thanh toán.
            </CardDescription>
            <pre className="qr-result">{qrResult}</pre>
            <Button onClick={() => setIsFormOpen(true)}>Tôi đã thanh toán · Ghi tiền ra</Button>
          </CardContent>
        </Card>
      )}
      <div className="row">
        <Button
          variant="ghost"
          onClick={() => {
            setImageResult('');
            setImageNote('');
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
      <Alert role="note" className="rounded-2xl bg-accent/40">
        <ShieldCheck />
        <AlertDescription>Camera và ảnh QR được xử lý ngay trên thiết bị.</AlertDescription>
      </Alert>
      {isFormOpen && (
        <Modal title="Xác nhận tiền ra" onClose={() => setIsFormOpen(false)}>
          <TransactionForm onSaved={() => setIsFormOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default ScanPage;
