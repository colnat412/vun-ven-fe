import {
  Bike,
  Ellipsis,
  Gamepad2,
  ReceiptText,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  'Ăn uống': Utensils,
  'Di chuyển': Bike,
  'Mua sắm': ShoppingBag,
  'Hóa đơn': ReceiptText,
  'Giải trí': Gamepad2,
  Khác: Ellipsis,
};
