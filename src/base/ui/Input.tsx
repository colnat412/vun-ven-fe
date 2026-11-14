import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input as ShadcnInput } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  error?: string;
  startIcon?: ReactNode;
  controlSize?: 'sm' | 'default';
  hideLabel?: boolean;
};
const Input = (componentProps: InputProps) => {
  const {
    label,
    error,
    startIcon,
    id,
    className,
    controlSize = 'default',
    hideLabel = false,
    ...props
  } = componentProps;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputProps = {
    ...props,
    id: inputId,
    'aria-invalid': !!error,
    'aria-describedby':
      [props['aria-describedby'], error && `${inputId}-error`].filter(Boolean).join(' ') ||
      undefined,
  };
  return (
    <Field className="field gap-2" data-invalid={!!error}>
      <FieldLabel htmlFor={inputId} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </FieldLabel>
      {startIcon ? (
        <InputGroup
          className={cn(
            'rounded-xl bg-[var(--surface-input)] dark:bg-[var(--surface-input)]',
            controlSize === 'sm'
              ? 'h-8 rounded-lg has-[[data-slot=input-group-control]:focus-visible]:ring-1'
              : 'h-12',
          )}
        >
          <InputGroupInput
            {...inputProps}
            className={cn(
              'h-full py-2 text-base md:text-sm',
              controlSize === 'sm' && 'py-1 text-[13px] md:text-[13px]',
              className,
            )}
          />
          <InputGroupAddon
            aria-hidden="true"
            className={controlSize === 'sm' ? 'pl-2 [&>svg]:size-3.5' : undefined}
          >
            {startIcon}
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <ShadcnInput
          {...inputProps}
          className={cn(
            'input',
            controlSize === 'sm' && 'h-8 min-h-8 rounded-lg py-1 text-[13px]',
            className,
          )}
        />
      )}
      {error && (
        <FieldError id={`${inputId}-error`} className="field-error">
          {error}
        </FieldError>
      )}
    </Field>
  );
};
export default Input;
