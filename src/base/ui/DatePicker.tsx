import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { vi } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { useId, useState } from 'react';
import { calendarDateKey, formatDate, toCalendarDate, today } from '../utils/date';

type DatePickerProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};
const DatePicker = (props: DatePickerProps) => {
  const { label, value, onValueChange } = props;
  const id = useId();
  const [open, setOpen] = useState(false);
  const selected = value ? toCalendarDate(value) : undefined;
  return (
    <Field className="field gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-12 w-full justify-between rounded-xl bg-[var(--surface-input)] px-3 font-normal"
          >
            <span>{selected ? formatDate(value) : 'Chọn ngày'}</span>
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Chọn ngày giao dịch" className="p-0">
          <Calendar
            mode="single"
            locale={vi}
            weekStartsOn={1}
            selected={selected}
            defaultMonth={selected}
            captionLayout="dropdown"
            startMonth={new Date(2000, 0)}
            endMonth={new Date(2100, 11)}
            autoFocus
            required
            onSelect={(date) => {
              onValueChange(calendarDateKey(date));
              setOpen(false);
            }}
          />
          <div className="border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                onValueChange(today());
                setOpen(false);
              }}
            >
              Hôm nay
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
};
export default DatePicker;
