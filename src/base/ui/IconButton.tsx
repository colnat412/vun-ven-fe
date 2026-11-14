import Button, { type ButtonProps } from './Button';

type IconButtonProps = Omit<Extract<ButtonProps, { asChild?: false }>, 'asChild' | 'aria-label'> & {
  label: string;
};
const IconButton = (componentProps: IconButtonProps) => {
  const {
    label,
    className = '',
    type = 'button',
    variant = 'ghost',
    size = 'icon',
    loadingLabel = '',
    ...props
  } = componentProps;
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      loadingLabel={loadingLabel}
      type={type}
      aria-label={label}
      title={label}
      className={`icon-button ${className}`}
    />
  );
};
export default IconButton;
