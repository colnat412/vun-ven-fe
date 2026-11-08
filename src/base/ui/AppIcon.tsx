import type { SVGProps } from 'react';
import icons from '../../assets/icons.svg?no-inline';

type AppIconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> & {
  name: 'home' | 'time-past' | 'qr-scan' | 'piggy-bank-budget' | 'stats';
  size?: number;
};
const AppIcon = (componentProps: AppIconProps) => {
  const { name, size = 24, ...props } = componentProps;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`${icons}#${name}`} />
    </svg>
  );
};
export default AppIcon;
