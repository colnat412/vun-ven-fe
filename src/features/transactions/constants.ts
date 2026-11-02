import type { Category } from './types';

export const categories: Category[] = [
  'Ăn uống',
  'Di chuyển',
  'Mua sắm',
  'Hóa đơn',
  'Giải trí',
  'Khác',
];
export const wallets = ['Tiền mặt', 'Chuyển khoản'];
export const categoryColors: Record<Category, string> = {
  'Ăn uống': 'var(--chart-1)',
  'Di chuyển': 'var(--chart-2)',
  'Mua sắm': 'var(--chart-3)',
  'Hóa đơn': 'var(--chart-4)',
  'Giải trí': 'var(--chart-5)',
  Khác: 'var(--chart-6)',
};
