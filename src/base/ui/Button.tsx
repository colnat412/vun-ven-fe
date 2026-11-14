import { Button as ShadcnButton } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

type ShadcnButtonProps = ComponentProps<typeof ShadcnButton>;
type SharedProps = Omit<ShadcnButtonProps, 'variant' | 'asChild' | 'children' | 'disabled'> & {
  variant?: Exclude<ShadcnButtonProps['variant'], 'default'> | 'primary';
};
export type ButtonProps = SharedProps &
  (
    | {
        asChild: true;
        children: ReactElement;
        disabled?: never;
        isLoading?: never;
        loadingLabel?: never;
      }
    | {
        asChild?: false;
        children?: ReactNode;
        disabled?: boolean;
        isLoading?: boolean;
        loadingLabel?: string;
      }
  );
const Button = (componentProps: ButtonProps) => {
  const {
    variant = 'primary',
    isLoading = false,
    loadingLabel = 'Đang lưu…',
    asChild = false,
    size = 'default',
    disabled,
    className = '',
    children,
    type = 'button',
    ...props
  } = componentProps;
  return (
    <ShadcnButton
      {...props}
      asChild={asChild}
      size={size}
      variant={variant === 'primary' ? 'default' : variant}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled || isLoading}
      aria-busy={isLoading || props['aria-busy'] || undefined}
      className={cn(
        variant !== 'unstyled' && size === 'default' && ['button', `button--${variant}`],
        className,
      )}
    >
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" role={undefined} />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
};
export default Button;
