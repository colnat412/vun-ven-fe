import { Check } from 'lucide-react';
import type { RefObject } from 'react';
import AppIcon from '../../../base/ui/AppIcon';

type ScannerPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  result: string;
  error: string;
  isStarting: boolean;
};
const ScannerPreview = (props: ScannerPreviewProps) => {
  const { videoRef, result, error, isStarting } = props;
  return (
    <div className="scanner">
      <video ref={videoRef} muted playsInline aria-label="Camera quét mã QR" />
      <div className="scanner-shade" />
      <div className="scanner-frame">
        <i />
        <i />
        <i />
        <i />
        {!result && <AppIcon name="qr-scan" size={52} />}
        {result && <Check size={48} />}
      </div>
      <p className="scanner-caption">
        {result
          ? 'Đã tìm thấy mã QR'
          : error
            ? 'Camera chưa sẵn sàng'
            : isStarting
              ? 'Đang mở camera…'
              : 'Giữ mã QR trong khung hình'}
      </p>
    </div>
  );
};
export default ScannerPreview;
