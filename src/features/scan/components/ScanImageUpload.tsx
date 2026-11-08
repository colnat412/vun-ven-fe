import { Camera, ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import Button from '../../../base/ui/Button';

type ScanImageUploadProps = {
  isReading: boolean;
  onReadImage: (file?: File) => Promise<void>;
};
const ScanImageUpload = (props: ScanImageUploadProps) => {
  const { isReading, onReadImage } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  return (
    <>
      {' '}
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
          void onReadImage(event.target.files?.[0]);
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
          void onReadImage(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </>
  );
};
export default ScanImageUpload;
