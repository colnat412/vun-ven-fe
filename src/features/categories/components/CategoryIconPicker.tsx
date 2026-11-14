import Button from '@/base/ui/Button';
import { cn } from '@/lib/utils';
import CategoryIcon from '../../transactions/components/CategoryIcon';
import { categoryIconOptions } from '../categoryIcons';

type Props = {
  value: string | null;
  name: string;
  disabled: boolean;
  error: string;
  onChange: (value: string | null) => void;
};

export default function CategoryIconPicker({ value, name, disabled, onChange }: Props) {
  // const custom = value?.startsWith('emoji:') ?? false;
  return (
    <fieldset disabled={disabled} className="grid min-w-0 gap-3">
      <legend className="mb-3 text-sm font-semibold">Biểu tượng danh mục</legend>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <CategoryIcon category={name} icon={value} size={28} />
        </span>
        <span className="min-w-0 truncate text-sm font-medium">
          {name.trim() || 'Danh mục của bạn'}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2" role="group" aria-label="Icon có sẵn">
        {categoryIconOptions.map(({ id, label, Icon }) => (
          <Button
            variant="unstyled"
            type="button"
            key={id}
            aria-label={label}
            title={label}
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={cn(
              'flex aspect-square min-h-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent',
              value === id && 'border-primary bg-primary/10 text-primary',
            )}
          >
            <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
          </Button>
        ))}
      </div>
      {/* <Input
        label="Emoji tùy chỉnh"
        placeholder="Ví dụ: ☕ hoặc 🐱"
        value={custom ? value!.slice(6) : ''}
        maxLength={32}
        disabled={disabled}
        error={error}
        onChange={(event) =>
          onChange(event.target.value ? `emoji:${event.target.value.trim()}` : null)
        }
      />
      <Button variant="unstyled"
        type="button"
        className="text-link justify-self-start text-xs"
        onClick={() => onChange(null)}
      >
        Dùng icon mặc định theo tên
      </Button> */}
    </fieldset>
  );
}
