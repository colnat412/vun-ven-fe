import { buttonVariants } from './button-variants';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
export { Button };
