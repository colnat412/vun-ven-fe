import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Button from '@/base/ui/Button';
import type { AvatarCrop } from './utils/prepareAvatar';

type Props = {
  file: File;
  busy: boolean;
  onSave: (crop: AvatarCrop) => void;
  onCancel: () => void;
};
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

const AvatarEditor = ({ file, busy, onSave, onCancel }: Props) => {
  const [image, setImage] = useState<{ url: string; width: number; height: number }>();
  const [error, setError] = useState('');
  const [crop, setCrop] = useState<AvatarCrop>({ zoom: 1, x: 0, y: 0 });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    let active = true;
    const preview = new Image();
    preview.src = url;
    preview
      .decode()
      .then(() => {
        if (active) setImage({ url, width: preview.naturalWidth, height: preview.naturalHeight });
      })
      .catch(() => {
        if (active) setError('Không đọc được ảnh này. Hãy chọn ảnh khác.');
      });
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const side = image ? Math.min(image.width, image.height) : 1;
  const width = image ? (image.width / side) * crop.zoom : 1;
  const height = image ? (image.height / side) * crop.zoom : 1;
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const previous = drag.current;
    if (!previous || previous.id !== event.pointerId || busy) return;
    const size = event.currentTarget.getBoundingClientRect().width;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setCrop((current) => ({
      ...current,
      x: width > 1 ? clamp(current.x + (2 * dx) / (size * (width - 1))) : 0,
      y: height > 1 ? clamp(current.y + (2 * dy) / (size * (height - 1))) : 0,
    }));
  };

  return (
    <div className="grid min-w-0 justify-items-center gap-4">
      <p className="small text-center text-muted-foreground">
        Kéo ảnh để căn chỉnh, kéo thanh bên dưới để phóng to.
      </p>
      <div
        className="relative aspect-square w-full max-w-64 touch-none overflow-hidden rounded-full border-2 border-primary bg-muted outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
        role="group"
        aria-label="Vùng cắt ảnh đại diện. Dùng phím mũi tên để di chuyển ảnh."
        tabIndex={0}
        style={{ cursor: busy ? 'wait' : 'grab' }}
        onPointerDown={(event) => {
          if (busy || !image) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (busy || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key))
            return;
          event.preventDefault();
          setCrop((current) => ({
            ...current,
            x: clamp(
              current.x + (event.key === 'ArrowLeft' ? -0.1 : event.key === 'ArrowRight' ? 0.1 : 0),
            ),
            y: clamp(
              current.y + (event.key === 'ArrowUp' ? -0.1 : event.key === 'ArrowDown' ? 0.1 : 0),
            ),
          }));
        }}
      >
        {image && (
          <img
            src={image.url}
            alt="Xem trước ảnh đại diện"
            draggable={false}
            className="pointer-events-none absolute select-none"
            style={{
              width: `${width * 100}%`,
              maxWidth: 'none',
              height: 'auto',
              left: `${50 + crop.x * (width - 1) * 50}%`,
              top: `${50 + crop.y * (height - 1) * 50}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <label className="grid w-full gap-2 text-sm">
        <span className="flex justify-between">
          <span>Phóng to</span>
          <span>{Math.round(crop.zoom * 100)}%</span>
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={crop.zoom}
          disabled={busy || !image}
          onChange={(event) =>
            setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))
          }
          className="w-full accent-primary"
        />
      </label>
      <div className="grid w-full grid-cols-2 gap-3">
        <Button type="button" variant="ghost" disabled={busy} onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="button"
          isLoading={busy}
          disabled={!image || !!error}
          onClick={() => onSave(crop)}
        >
          Dùng ảnh này
        </Button>
      </div>
    </div>
  );
};

export default AvatarEditor;
