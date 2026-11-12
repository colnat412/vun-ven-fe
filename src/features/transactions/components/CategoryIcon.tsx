import { categoryIcons } from '../categoryIcons';
import { getCategoryColor } from '../constants';

const CategoryIcon = ({ category, size = 18 }: { category: string; size?: number }) => {
  const Icon = Object.hasOwn(categoryIcons, category)
    ? categoryIcons[category]
    : categoryIcons.Khác;
  return (
    <Icon
      size={size}
      strokeWidth={1.7}
      className="shrink-0"
      style={{ color: getCategoryColor(category) }}
      aria-hidden="true"
    />
  );
};

export default CategoryIcon;
