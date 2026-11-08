import { Button } from '@/components/ui/button';
import type { ComponentPropsWithoutRef } from 'react';

type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  label: string;
};
const IconButton = (componentProps: IconButtonProps) => {
  const { label, className = '', type = 'button', ...props } = componentProps;
  return (
    <Button
      {...props}
      variant="ghost"
      size="icon"
      type={type}
      aria-label={label}
      title={label}
      className={`icon-button ${className}`}
    />
  );
};
export default IconButton;
