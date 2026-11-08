import jsQR from 'jsqr';
import { useState } from 'react';
const useQrImage = () => {
  const [imageResult, setImageResult] = useState('');
  const [imageNote, setImageNote] = useState('');
  const [isReading, setIsReading] = useState(false);
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

  const resetImage = () => {
    setImageResult('');
    setImageNote('');
  };
  return { imageResult, imageNote, isReading, readImage, resetImage };
};
export default useQrImage;
