import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Button from './Button';
import Input from './Input';
import type { SelectFieldProps, SelectOption } from './SelectField';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/gi, 'd')
    .toLocaleLowerCase('vi')
    .replace(/\s+/g, '');

// Used by SelectField's searchable mode; keeps selection, focus and keyboard behavior in base.
export default function SearchableSelectField({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Chọn một mục',
  disabled,
  name,
  searchPlaceholder = 'Tìm theo tên…',
  searchSize = 'sm',
}: SelectFieldProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const items: SelectOption[] = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const selected = items.find((option) => option.value === value);
  const filtered = items.filter((option) =>
    normalize([option.label, option.value, ...(option.keywords ?? [])].join(' ')).includes(
      normalize(query),
    ),
  );
  const enabled = filtered.filter((option) => !option.disabled);
  const activeValue = enabled.some((option) => option.value === active)
    ? active
    : enabled[0]?.value;
  const activeIndex = filtered.findIndex((option) => option.value === activeValue);
  useEffect(() => {
    if (open && activeIndex >= 0)
      list.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, query]);
  const choose = (option: SelectOption) => {
    if (option.disabled || disabled) return;
    onValueChange(option.value);
    setOpen(false);
  };
  return (
    <Field className="field min-w-0 gap-2">
      <FieldLabel id={`${id}-label`} htmlFor={id}>
        {label}
      </FieldLabel>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
      <Popover
        open={open && !disabled}
        onOpenChange={(next) => {
          setOpen(next);
          setQuery('');
          setActive(value);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="unstyled"
            role="combobox"
            aria-labelledby={`${id}-label`}
            aria-haspopup="listbox"
            aria-expanded={open && !disabled}
            aria-controls={open ? `${id}-list` : undefined}
            disabled={disabled || !items.length}
            className="input flex w-full min-w-0 items-center justify-between gap-2 text-left data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/20"
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected?.icon}
              <span className={cn('truncate', !selected && 'text-muted-foreground')}>
                {selected?.label ?? placeholder}
              </span>
            </span>
            <ChevronsUpDown
              size={16}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex max-h-[min(24rem,var(--radix-popover-content-available-height))] w-[var(--radix-popover-trigger-width)] min-w-0 flex-col gap-2 p-2"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            input.current?.focus();
          }}
        >
          <Input
            ref={input}
            label={`Tìm ${label.toLocaleLowerCase('vi')}`}
            hideLabel
            controlSize={searchSize}
            placeholder={searchPlaceholder}
            value={query}
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            autoComplete="off"
            aria-controls={`${id}-list`}
            aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
            startIcon={<Search size={16} />}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const index = enabled.findIndex((option) => option.value === activeValue);
                const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
                setActive(enabled[(next + enabled.length) % enabled.length]?.value ?? '');
              } else if (event.key === 'Enter') {
                event.preventDefault();
                const option = enabled.find((row) => row.value === activeValue);
                if (option) choose(option);
              }
            }}
          />
          <div
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="min-h-0 overflow-y-auto overscroll-contain"
          >
            {filtered.map((option, index) => (
              <Button
                key={option.value}
                id={`${id}-option-${index}`}
                variant="unstyled"
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                disabled={option.disabled}
                tabIndex={-1}
                className={cn(
                  'flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm',
                  option.value === activeValue && 'bg-accent text-accent-foreground',
                  option.value === value && 'font-medium text-primary',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onPointerMove={() => setActive(option.value)}
                onClick={() => choose(option)}
              >
                {option.icon}
                <span className="min-w-0 flex-1 whitespace-normal wrap-anywhere">
                  {option.label}
                </span>
                {option.value === value && (
                  <Check size={16} className="shrink-0" aria-hidden="true" />
                )}
              </Button>
            ))}
          </div>
          {!filtered.length && (
            <p role="status" className="px-3 py-4 text-sm text-muted-foreground">
              Không tìm thấy kết quả.
            </p>
          )}
        </PopoverContent>
      </Popover>
    </Field>
  );
}
