import { useId, type CSSProperties } from 'react';
import CategoryIcon from './CategoryIcon';
import { getCategoryColor } from '../constants';

const CategoryJar = ({ category, percent }: { category: string; percent: number }) => {
  const id = useId();
  const level = Math.max(0, Math.min(100, percent));
  const fillHeight = (84 * level) / 100;
  return (
    <div
      className="category-jar"
      style={{ '--jar-color': getCategoryColor(category) } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 112 136" fill="none" focusable="false">
        <defs>
          <clipPath id={`${id}-body`}>
            <path d="M28 30h56v8c0 6 13 11 13 24v39c0 11-8 17-19 17H34c-11 0-19-6-19-17V62c0-13 13-18 13-24v-8Z" />
          </clipPath>
          <pattern id={`${id}-coins`} width="25" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M1 5v3c0 5 22 5 22 0V5"
              fill="currentColor"
              fillOpacity=".55"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <ellipse cx="12" cy="5" rx="11" ry="4" fill="var(--card)" />
            <ellipse
              cx="12"
              cy="5"
              rx="11"
              ry="4"
              fill="currentColor"
              fillOpacity=".35"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M9 5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </pattern>
        </defs>
        <ellipse cx="56" cy="127" rx="38" ry="4" fill="currentColor" opacity=".09" />
        <path
          d="M28 30h56v8c0 6 13 11 13 24v39c0 11-8 17-19 17H34c-11 0-19-6-19-17V62c0-13 13-18 13-24v-8Z"
          fill="currentColor"
          fillOpacity=".05"
        />
        <g clipPath={`url(#${id}-body)`}>
          <svg x="15" y={118 - fillHeight} width="82" height={fillHeight} overflow="hidden">
            <rect width="82" height="84" fill="currentColor" fillOpacity=".18" />
            <rect width="82" height="84" fill={`url(#${id}-coins)`} />
          </svg>
        </g>
        <path
          d="M28 30h56v8c0 6 13 11 13 24v39c0 11-8 17-19 17H34c-11 0-19-6-19-17V62c0-13 13-18 13-24v-8Z"
          stroke="currentColor"
          strokeOpacity=".55"
          strokeWidth="2"
        />
        <path
          d="M23 65v31"
          stroke="var(--card)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".85"
        />
        <rect x="23" y="20" width="66" height="12" rx="5" fill="var(--card)" />
        <rect
          x="23"
          y="20"
          width="66"
          height="12"
          rx="5"
          fill="currentColor"
          fillOpacity=".24"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M33 24v4m10-4v4m13-4v4m13-4v4m10-4v4"
          stroke="currentColor"
          strokeOpacity=".45"
          strokeLinecap="round"
        />
      </svg>
      <span className="category-jar-icon">
        <CategoryIcon category={category} size={21} />
      </span>
    </div>
  );
};

export default CategoryJar;
