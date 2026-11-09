import type { Category } from '../transactions/types';
export type ReportCategoryRow = {
  category: Category;
  amount: bigint;
  share: number;
  color: string;
};
export type ReportDayRow = { day: number; value: number; amount: bigint };
