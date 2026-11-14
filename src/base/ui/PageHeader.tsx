import Button from '@/base/ui/Button';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  onBack,
  eyebrow,
  action,
}: {
  title: string;
  onBack: () => void;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-3">
      <Button
        variant="unstyled"
        type="button"
        className="flex size-[42px] shrink-0 items-center justify-center rounded-[14px] border border-border bg-card text-foreground hover:bg-accent"
        aria-label="Quay lại"
        title="Quay lại"
        onClick={onBack}
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </Button>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-1 text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}
