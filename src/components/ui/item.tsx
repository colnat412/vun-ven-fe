import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

type ItemGroupProps = React.ComponentProps<'div'>;
type ItemSeparatorProps = React.ComponentProps<typeof Separator>;
type ItemProps = React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean;
  };
type ItemMediaProps = React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>;
type ItemContentProps = React.ComponentProps<'div'>;
type ItemTitleProps = React.ComponentProps<'div'>;
type ItemDescriptionProps = React.ComponentProps<'p'>;
type ItemActionsProps = React.ComponentProps<'div'>;
type ItemHeaderProps = React.ComponentProps<'div'>;
type ItemFooterProps = React.ComponentProps<'div'>;
const ItemGroup = (componentProps: ItemGroupProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn('group/item-group flex flex-col', className)}
      {...props}
    />
  );
};
const ItemSeparator = (componentProps: ItemSeparatorProps) => {
  const { className, ...props } = componentProps;
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('my-0', className)}
      {...props}
    />
  );
};
const itemVariants = cva(
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50',
      },
      size: {
        default: 'gap-4 p-4',
        sm: 'gap-2.5 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
const Item = (componentProps: ItemProps) => {
  const {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
  } = componentProps;
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
};
const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
        image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
const ItemMedia = (componentProps: ItemMediaProps) => {
  const { className, variant = 'default', ...props } = componentProps;
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
};
const ItemContent = (componentProps: ItemContentProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="item-content"
      className={cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', className)}
      {...props}
    />
  );
};
const ItemTitle = (componentProps: ItemTitleProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="item-title"
      className={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', className)}
      {...props}
    />
  );
};
const ItemDescription = (componentProps: ItemDescriptionProps) => {
  const { className, ...props } = componentProps;
  return (
    <p
      data-slot="item-description"
      className={cn(
        'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
};
const ItemActions = (componentProps: ItemActionsProps) => {
  const { className, ...props } = componentProps;
  return (
    <div data-slot="item-actions" className={cn('flex items-center gap-2', className)} {...props} />
  );
};
const ItemHeader = (componentProps: ItemHeaderProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="item-header"
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...props}
    />
  );
};
const ItemFooter = (componentProps: ItemFooterProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="item-footer"
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...props}
    />
  );
};
export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
