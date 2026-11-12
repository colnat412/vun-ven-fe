import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useId, type ReactNode } from 'react';

export type SelectOption = { value: string; label: string; disabled?: boolean; icon?: ReactNode };

type SelectFieldProps = {
  label: string;
  value: string;
  options: (string | SelectOption)[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
};
const SelectField = (props: SelectFieldProps) => {
  const {
    label,
    value,
    options,
    onValueChange,
    placeholder = 'Chọn một mục',
    disabled,
    name,
  } = props;
  const id = useId();
  const items: SelectOption[] = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const selected = items.find((option) => option.value === value);
  return (
    <Field className="field min-w-0 gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || !items.length}
        name={name}
      >
        <SelectTrigger
          id={id}
          className="input w-full min-w-0 text-left data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/20"
        >
          <SelectValue placeholder={placeholder} className="min-w-0 flex-1">
            {selected ? (
              <span className="flex min-w-0 items-center gap-2">
                {selected.icon}
                <span className="min-w-0 truncate">{selected.label}</span>
              </span>
            ) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="max-h-[min(18rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] min-w-0 max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-popover text-popover-foreground shadow-lg [&_[data-radix-select-viewport]]:min-w-0"
        >
          {items.map((option) => (
            <SelectItem
              key={option.value}
              textValue={option.label}
              value={option.value}
              disabled={option.disabled}
              className="min-h-11 cursor-pointer rounded-lg py-2.5 pr-9 pl-3 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:font-medium data-[state=checked]:text-primary"
            >
              <span className="flex min-w-0 items-center gap-2">
                {option.icon}
                <span className="min-w-0 whitespace-normal wrap-anywhere">{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};
export default SelectField;
