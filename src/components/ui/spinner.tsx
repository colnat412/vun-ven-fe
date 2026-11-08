import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

type SpinnerProps = React.ComponentProps<'svg'>;
const Spinner = (componentProps: SpinnerProps) => {
  const { className, ...props } = componentProps;
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
};
export { Spinner };
