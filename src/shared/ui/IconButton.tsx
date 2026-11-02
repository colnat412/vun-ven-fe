import type { ComponentPropsWithoutRef } from 'react';
import { Button } from '@/components/ui/button';

type IconButtonProps = ComponentPropsWithoutRef<'button'> & { label: string };

const IconButton = ({ label, className = '', type = 'button', ...props }: IconButtonProps) => (
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

export default IconButton;
