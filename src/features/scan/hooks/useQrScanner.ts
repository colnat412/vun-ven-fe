import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const useQrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [restartId, setRestartId] = useState(0);
  const [isStarting, setIsStarting] = useState(true);
  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | undefined;
    let animationId = 0;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const stop = () => {
      stream?.getTracks().forEach((track) => track.stop());
      cancelAnimationFrame(animationId);
    };
    const tick = () => {
      const video = videoRef.current;
      if (cancelled || !video || !context) return;
      if (video.readyState >= 2 && video.videoWidth) {
        const scale = Math.min(1, 640 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const qr = jsQR(pixels.data, pixels.width, pixels.height, {
          inversionAttempts: 'dontInvert',
        });
        if (qr) {
          setResult(qr.data);
          stop();
          return;
        }
      }
      animationId = requestAnimationFrame(tick);
    };
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            'Camera cần HTTPS hoặc localhost và trình duyệt hỗ trợ. Bạn có thể tải ảnh QR lên.',
          );
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stop();
          return;
        }
        const video = videoRef.current;
        if (!video) {
          stop();
          return;
        }
        video.srcObject = stream;
        await video.play();
        if (cancelled) {
          stop();
          return;
        }
        animationId = requestAnimationFrame(tick);
      } catch (cause) {
        stop();
        if (!cancelled)
          setError(
            cause instanceof DOMException && cause.name === 'NotAllowedError'
              ? 'Bạn chưa cấp quyền camera. Hãy bật quyền trong trình duyệt hoặc tải ảnh QR lên.'
              : cause instanceof Error
                ? cause.message
                : 'Không mở được camera. Hãy thử tải ảnh lên.',
          );
      } finally {
        if (!cancelled) setIsStarting(false);
      }
    };
    void start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [restartId]);
  const restart = () => {
    setResult('');
    setError('');
    setIsStarting(true);
    setRestartId((value) => value + 1);
  };
  return { videoRef, result, error, isStarting, restart };
};

export default useQrScanner;
