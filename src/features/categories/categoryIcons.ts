import {
  Bike,
  BookOpen,
  BriefcaseBusiness,
  Car,
  Coffee,
  Ellipsis,
  Gamepad2,
  Gift,
  Heart,
  House,
  Leaf,
  Music,
  PawPrint,
  Plane,
  ReceiptText,
  ShoppingBag,
  Utensils,
  Wallet,
} from 'lucide-react';

export const categoryIconOptions = [
  { id: 'utensils', label: 'Ăn uống', Icon: Utensils },
  { id: 'coffee', label: 'Cà phê', Icon: Coffee },
  { id: 'bike', label: 'Xe đạp', Icon: Bike },
  { id: 'car', label: 'Ô tô', Icon: Car },
  { id: 'shopping-bag', label: 'Mua sắm', Icon: ShoppingBag },
  { id: 'receipt', label: 'Hóa đơn', Icon: ReceiptText },
  { id: 'gamepad', label: 'Giải trí', Icon: Gamepad2 },
  { id: 'heart', label: 'Sức khỏe', Icon: Heart },
  { id: 'home', label: 'Nhà cửa', Icon: House },
  { id: 'book', label: 'Học tập', Icon: BookOpen },
  { id: 'gift', label: 'Quà tặng', Icon: Gift },
  { id: 'plane', label: 'Du lịch', Icon: Plane },
  { id: 'briefcase', label: 'Công việc', Icon: BriefcaseBusiness },
  { id: 'wallet', label: 'Tài chính', Icon: Wallet },
  { id: 'music', label: 'Âm nhạc', Icon: Music },
  { id: 'paw', label: 'Thú cưng', Icon: PawPrint },
  { id: 'leaf', label: 'Cây xanh', Icon: Leaf },
  { id: 'ellipsis', label: 'Khác', Icon: Ellipsis },
] as const;

export function isCategoryIcon(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value !== 'string' || value.length > 64) return false;
  if (categoryIconOptions.some(({ id }) => id === value)) return true;
  if (!value.startsWith('emoji:')) return false;
  const emoji = value.slice(6);
  return (
    [...new Intl.Segmenter('vi', { granularity: 'grapheme' }).segment(emoji)].length === 1 &&
    /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20e3/u.test(emoji)
  );
}
