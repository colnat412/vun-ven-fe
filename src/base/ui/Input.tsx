import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input as ShadcnInput } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
  startIcon?: ReactNode;
};
const Input = (componentProps: InputProps) => {
  const { label, error, startIcon, id, className, ...props } = componentProps;
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
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      {startIcon ? (
        <InputGroup className="h-12 rounded-xl bg-[var(--surface-input)] dark:bg-[var(--surface-input)]">
          <InputGroupInput
            {...inputProps}
            className={cn('h-full py-2 text-base md:text-sm', className)}
          />
          <InputGroupAddon aria-hidden="true">{startIcon}</InputGroupAddon>
        </InputGroup>
      ) : (
        <ShadcnInput {...inputProps} className={cn('input', className)} />
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
