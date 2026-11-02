import * as React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';
const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="card" className={cn('card', className)} {...props} />;
};
const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header mb-4 grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  );
};
const CardTitle = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'h2'> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot.Root : 'h2';
  return (
    <Comp
      data-slot="card-title"
      className={cn('text-base leading-snug font-semibold', className)}
      {...props}
    />
  );
};
const CardDescription = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};
const CardAction = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
};
const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="card-content" className={cn('p-0', className)} {...props} />;
};
const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center [.border-t]:pt-4', className)}
      {...props}
    />
  );
};
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
