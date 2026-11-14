import Button from '@/base/ui/Button';
import { useEffect, useId, useRef, useState } from 'react';
import { Camera, QrCode } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';

export default function CaptureActions({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionsId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={root} className="capture-actions">
      <Button
        variant="unstyled"
        ref={trigger}
        type="button"
        className={cn('nav-camera', (active || open) && 'nav-camera--active')}
        aria-label="Chụp ảnh hoặc quét QR"
        title="Chụp ảnh hoặc quét QR"
        aria-expanded={open}
        aria-controls={open ? optionsId : undefined}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="nav-camera-icon">
          <Camera size={28} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </Button>
      {open && (
        <div
          id={optionsId}
          className="capture-actions__options"
          role="group"
          aria-label="Chụp ảnh và quét QR"
        >
          <Link
            to="/capture"
            state={{ returnTo: location.pathname + location.search }}
            className="capture-actions__option"
            aria-label="Chụp ảnh"
            title="Chụp ảnh"
            onClick={() => setOpen(false)}
          >
            <Camera size={24} strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <Link
            to="/scan"
            state={{ returnTo: location.pathname + location.search }}
            className="capture-actions__option"
            aria-label="Quét QR"
            title="Quét QR"
            onClick={() => setOpen(false)}
          >
            <QrCode size={24} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
