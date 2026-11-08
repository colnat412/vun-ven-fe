import { cn } from '@/lib/utils';
import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorStyle?: React.CSSProperties;
};
const Progress = (componentProps: ProgressProps) => {
  const { className, value, indicatorStyle, ...props } = componentProps;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  );
};
export { Progress };
