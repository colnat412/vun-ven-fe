import { buttonVariants } from './button-variants';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

type ButtonProps = React.ComponentProps<'button'> &
  Omit<VariantProps<typeof buttonVariants>, 'variant'> & {
    variant?: VariantProps<typeof buttonVariants>['variant'] | 'unstyled';
    asChild?: boolean;
  };

const Button = (componentProps: ButtonProps) => {
  const {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
  } = componentProps;
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={
        variant === 'unstyled'
          ? cn(
              'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
              className,
            )
          : cn(buttonVariants({ variant, size, className }))
      }
      {...props}
    />
  );
};
export { Button };
