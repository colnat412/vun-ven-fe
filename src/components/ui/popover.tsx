import { cn } from '@/lib/utils';
import { Popover as PopoverPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

const Popover = (props: ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root {...props} />
);
const PopoverTrigger = (props: ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);
const PopoverContent = (componentProps: ComponentProps<typeof PopoverPrimitive.Content>) => {
  const { className, align = 'start', sideOffset = 8, ...props } = componentProps;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          'z-50 w-auto max-w-[calc(100vw-24px)] rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-lg outline-none',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
};
export { Popover, PopoverContent, PopoverTrigger };
