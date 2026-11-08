import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useState } from 'react';

type MonthPickerProps = {
  label: string;
  hideLabel?: boolean;
  value: string;
  onValueChange: (value: string) => void;
};
const years = Array.from({ length: 101 }, (_, index) => String(2000 + index));
const MonthPicker = (props: MonthPickerProps) => {
  const { label, hideLabel = false, value, onValueChange } = props;
  const id = useId();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value.slice(0, 4)));
  return (
    <Field className="field gap-2">
      <FieldLabel htmlFor={id} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </FieldLabel>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next) setYear(Number(value.slice(0, 4)));
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-12 w-full justify-between rounded-xl bg-[var(--surface-input)] px-3 font-normal"
          >
            Tháng {Number(value.slice(5))}, {value.slice(0, 4)}
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Chọn tháng" className="w-72">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Năm trước"
              disabled={year <= 2000}
              onClick={() => setYear(year - 1)}
            >
              <ChevronLeft />
            </Button>
            <Select value={String(year)} onValueChange={(next) => setYear(Number(next))}>
              <SelectTrigger aria-label="Năm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Năm sau"
              disabled={year >= 2100}
              onClick={() => setYear(year + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, index) => {
              const month = `${year}-${String(index + 1).padStart(2, '0')}`;
              return (
                <Button
                  key={month}
                  type="button"
                  variant={month === value ? 'default' : 'ghost'}
                  aria-pressed={month === value}
                  className="h-11 rounded-xl"
                  onClick={() => {
                    onValueChange(month);
                    setOpen(false);
                  }}
                >
                  Tháng {index + 1}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
};
export default MonthPicker;
