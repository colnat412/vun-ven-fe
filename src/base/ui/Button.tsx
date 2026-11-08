import { Button as ShadcnButton } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
};
const Button = (componentProps: ButtonProps) => {
  const {
    variant = 'primary',
    isLoading = false,
    disabled,
    className = '',
    children,
    type = 'button',
    ...props
  } = componentProps;
  return (
    <ShadcnButton
      {...props}
      variant={variant === 'primary' ? 'default' : variant}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn('button', `button--${variant}`, className)}
    >
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" role={undefined} />
          Đang lưu…
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
};
export default Button;
