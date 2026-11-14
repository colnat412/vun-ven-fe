import { categoryIcons } from '../categoryIcons';
import { getCategoryColor } from '../constants';
import { useBook } from '../hooks/useBook';
import { categoryIconOptions, isCategoryIcon } from '../../categories/categoryIcons';

const CategoryIcon = ({
  category,
  size = 18,
  icon,
}: {
  category: string;
  size?: number;
  icon?: string | null;
}) => {
  const book = useBook();
  const selected =
    icon !== undefined
      ? icon
      : book.data?.categoryDefinitions?.find((row) => row.name === category)?.icon;
  if (selected?.startsWith('emoji:') && isCategoryIcon(selected))
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center leading-none"
        style={{ width: size, height: size, fontSize: size }}
        aria-hidden="true"
      >
        {selected.slice(6)}
      </span>
    );
  const Icon =
    categoryIconOptions.find(({ id }) => id === selected)?.Icon ??
    (Object.hasOwn(categoryIcons, category) ? categoryIcons[category] : categoryIcons.Khác);
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
