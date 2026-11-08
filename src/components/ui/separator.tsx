import { cn } from '@/lib/utils';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import * as React from 'react';

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root>;
const Separator = (componentProps: SeparatorProps) => {
  const { className, orientation = 'horizontal', decorative = true, ...props } = componentProps;
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
};
export { Separator };
