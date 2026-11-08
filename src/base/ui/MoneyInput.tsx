import type { ComponentProps } from 'react';
import { amountError } from '../utils/amountValidation';
import Input from './Input';

type MoneyInputProps = Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode'
> & {
  value: string;
  onValueChange: (value: string) => void;
  minimum?: bigint;
};
const formatAmount = (value: string) =>
  /^\d+$/.test(value) ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value;
const integerInput = /^(?:\d*|\d{1,3}(?:,\d{3})+)$/;
const MoneyInput = (componentProps: MoneyInputProps) => {
  const {
    value,
    onValueChange,
    minimum = 0n,
    error,
    onKeyDown,
    onBeforeInput,
    onPaste,
    onDrop,
    ...props
  } = componentProps;
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      spellCheck={false}
      value={formatAmount(value)}
      error={error || (value === '' ? undefined : amountError(value, minimum))}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          event.key.length === 1 &&
          !/^[0-9]$/.test(event.key)
        )
          event.preventDefault();
      }}
      onBeforeInput={(event) => {
        onBeforeInput?.(event);
        const data = (event.nativeEvent as InputEvent).data;
        if (data && /[^0-9,]/.test(data)) event.preventDefault();
      }}
      onPaste={(event) => {
        onPaste?.(event);
        if (!integerInput.test(event.clipboardData.getData('text'))) event.preventDefault();
      }}
      onDrop={(event) => {
        onDrop?.(event);
        if (!integerInput.test(event.dataTransfer.getData('text'))) event.preventDefault();
      }}
      onChange={(event) => {
        const input = event.currentTarget;
        const cursor = input.selectionStart ?? input.value.length;
        if (/[^0-9,]/.test(input.value)) {
          input.value = formatAmount(value);
          const position = Math.min(cursor, input.value.length);
          input.setSelectionRange(position, position);
          return;
        }
        const digitsBeforeCursor = input.value.slice(0, cursor).replaceAll(',', '').length;
        const digits = input.value.replaceAll(',', '').replace(/^0+(?=\d)/, '');
        onValueChange(digits);
        requestAnimationFrame(() => {
          if (document.activeElement !== input) return;
          let position = 0;
          let digitsSeen = 0;
          while (position < input.value.length && digitsSeen < digitsBeforeCursor) {
            if (input.value[position] !== ',') digitsSeen += 1;
            position += 1;
          }
          input.setSelectionRange(position, position);
        });
      }}
    />
  );
};
export default MoneyInput;
