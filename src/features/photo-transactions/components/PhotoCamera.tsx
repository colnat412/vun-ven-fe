import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, ImagePlus, RotateCcw, X } from 'lucide-react';
import Button from '@/base/ui/Button';
import { preparePhoto } from '../utils/preparePhoto';

type Props = {
  photo: string;
  disabled: boolean;
  onPhoto: (photo: string) => void;
  onPreparing: (preparing: boolean) => void;
  onActiveChange: (active: boolean) => void;
};

export default function PhotoCamera({
  photo,
  disabled,
  onPhoto,
  onPreparing,
  onActiveChange,
}: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const request = useRef(0);
  const nativeCamera = useRef<HTMLInputElement>(null);
  const library = useRef<HTMLInputElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onActiveChange(live || opening);
  }, [live, opening, onActiveChange]);

  useEffect(
    () => () => {
      request.current += 1;
      stream.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const stop = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setLive(false);
    setReady(false);
  };

  const open = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      nativeCamera.current?.click();
      return;
    }
    const id = ++request.current;
    setOpening(true);
    setError('');
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1600 } },
        audio: false,
      });
      if (id !== request.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      setLive(true);
      if (video.current) video.current.srcObject = media;
    } catch {
      if (id === request.current)
        setError('Chưa mở được camera. Bạn có thể chọn ảnh hoặc dùng camera của thiết bị.');
    } finally {
      if (id === request.current) setOpening(false);
    }
  };

  const prepare = async (file: File) => {
    const id = ++request.current;
    onPreparing(true);
    setError('');
    try {
      const data = await preparePhoto(file);
      if (id !== request.current) return;
      onPhoto(data);
      stop();
    } catch (cause) {
      if (id === request.current)
        setError(cause instanceof Error ? cause.message : 'Không đọc được ảnh. Hãy chọn lại.');
    } finally {
      if (id === request.current) onPreparing(false);
    }
  };

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file && !disabled) void prepare(file);
  };

  const capture = () => {
    const source = video.current;
    if (!source?.videoWidth || disabled) return;
    const canvas = document.createElement('canvas');
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(source, 0, 0);
    onPreparing(true);
    canvas.toBlob(
      (blob) => {
        if (blob) void prepare(new File([blob], 'khoanh-khac.jpg', { type: 'image/jpeg' }));
        else {
          onPreparing(false);
          setError('Chưa chụp được ảnh. Hãy thử lại.');
        }
      },
      'image/jpeg',
      0.9,
    );
  };

  return (
    <>
      {photo && <img className="photo-camera__image" src={photo} alt="Ảnh sẽ lưu cùng giao dịch" />}
      <video
        ref={video}
        autoPlay
        muted
        playsInline
        className={`photo-camera__video ${live ? '' : 'photo-camera__video--hidden'}`}
        onLoadedData={() => setReady(true)}
      />
      {!photo && !live && (
        <div className="photo-camera__empty">
          <span className="photo-camera__symbol">
            <Camera size={36} strokeWidth={1.5} />
          </span>
          <h2>Khoảnh khắc hôm nay</h2>
          <p>Ly cà phê, bữa trưa hay món quà nhỏ.</p>
          <Button
            type="button"
            variant="secondary"
            className="photo-camera__open"
            disabled={disabled || opening}
            onClick={() => {
              void open();
            }}
          >
            <Camera size={18} />
            {opening ? 'Đang mở camera…' : 'Mở máy ảnh'}
          </Button>
        </div>
      )}
      <div className="photo-camera__tools">
        {live && (
          <Button
            variant="unstyled"
            type="button"
            aria-label="Đóng camera"
            disabled={disabled}
            onClick={stop}
          >
            <X size={20} />
          </Button>
        )}
        <Button
          variant="unstyled"
          type="button"
          title="Chọn ảnh"
          aria-label="Chọn ảnh từ thư viện"
          disabled={disabled || opening}
          onClick={() => library.current?.click()}
        >
          <ImagePlus size={20} />
        </Button>
        {(photo || live) && (
          <Button
            variant="unstyled"
            type="button"
            title="Chụp lại"
            aria-label="Chụp lại ảnh"
            disabled={disabled || opening}
            onClick={() => {
              stop();
              void open();
            }}
          >
            <RotateCcw size={20} />
          </Button>
        )}
        <Button
          variant="unstyled"
          type="button"
          title="Camera thiết bị"
          aria-label="Chụp bằng camera thiết bị"
          disabled={disabled || opening}
          onClick={() => nativeCamera.current?.click()}
        >
          <Camera size={20} />
        </Button>
      </div>
      {live && (
        <Button
          variant="unstyled"
          type="button"
          className="photo-camera__shutter"
          aria-label="Chụp ảnh"
          disabled={disabled || !ready}
          onClick={capture}
        >
          <span />
        </Button>
      )}
      {error && (
        <p role="alert" className="photo-camera__error">
          {error}
        </p>
      )}
      <input
        ref={nativeCamera}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        aria-label="Ảnh từ camera thiết bị"
        disabled={disabled || opening}
        onChange={choose}
      />
      <input
        ref={library}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Ảnh từ thư viện"
        disabled={disabled || opening}
        onChange={choose}
      />
    </>
  );
}
