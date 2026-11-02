import type { SVGProps } from 'react';

type BrandMarkProps = SVGProps<SVGSVGElement> & { size?: number };

const BrandMark = ({ size = 40, ...props }: BrandMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect width="64" height="64" rx="19" fill="var(--primary)" />
    <g
      stroke="var(--primary-foreground)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 27L43 49L54 27" opacity="0.75" />
      <path d="M10 15L21 37L32 15" />
    </g>
  </svg>
);

export default BrandMark;
