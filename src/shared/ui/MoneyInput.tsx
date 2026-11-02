import type { ComponentProps } from 'react';
import Input from './Input';

type MoneyInputProps = Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode'
> & {
  value: string;
  onValueChange: (value: string) => void;
};

const formatAmount = (value: string) =>
  /^\d+$/.test(value) ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value;

const MoneyInput = ({ value, onValueChange, ...props }: MoneyInputProps) => (
  <Input
    {...props}
    type="text"
    inputMode="numeric"
    value={formatAmount(value)}
    onChange={(event) => {
      const input = event.currentTarget;
      const cursor = input.selectionStart ?? input.value.length;
      const charactersBeforeCursor = input.value.slice(0, cursor).replaceAll(',', '').length;
      onValueChange(input.value.replaceAll(',', ''));
      // React updates the formatted value before the next frame. Keep the caret
      // next to the same digit, including when grouping inserts a comma.
      requestAnimationFrame(() => {
        if (document.activeElement !== input) return;
        let position = 0;
        let characters = 0;
        while (position < input.value.length && characters < charactersBeforeCursor) {
          if (input.value[position] !== ',') characters += 1;
          position += 1;
        }
        input.setSelectionRange(position, position);
      });
    }}
  />
);

export default MoneyInput;
