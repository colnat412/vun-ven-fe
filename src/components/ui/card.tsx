import { cn } from '@/lib/utils';
import { Slot } from 'radix-ui';
import * as React from 'react';

type CardProps = React.ComponentProps<'div'>;
type CardHeaderProps = React.ComponentProps<'div'>;
type CardTitleProps = React.ComponentProps<'h2'> & {
  asChild?: boolean;
};
type CardDescriptionProps = React.ComponentProps<'div'>;
type CardActionProps = React.ComponentProps<'div'>;
type CardContentProps = React.ComponentProps<'div'>;
type CardFooterProps = React.ComponentProps<'div'>;
const Card = (componentProps: CardProps) => {
  const { className, ...props } = componentProps;
  return <div data-slot="card" className={cn('card', className)} {...props} />;
};
const CardHeader = (componentProps: CardHeaderProps) => {
  const { className, ...props } = componentProps;
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
const CardTitle = (componentProps: CardTitleProps) => {
  const { className, asChild = false, ...props } = componentProps;
  const Comp = asChild ? Slot.Root : 'h2';
  return (
    <Comp
      data-slot="card-title"
      className={cn('text-base leading-snug font-semibold', className)}
      {...props}
    />
  );
};
const CardDescription = (componentProps: CardDescriptionProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};
const CardAction = (componentProps: CardActionProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
};
const CardContent = (componentProps: CardContentProps) => {
  const { className, ...props } = componentProps;
  return <div data-slot="card-content" className={cn('p-0', className)} {...props} />;
};
const CardFooter = (componentProps: CardFooterProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center [.border-t]:pt-4', className)}
      {...props}
    />
  );
};
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
