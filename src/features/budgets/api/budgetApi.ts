import { apiClient } from '@/lib/apiClient';
import { ApiError } from '@/base/api/httpClient';
import { monthKey } from '@/base/utils/date';
import { getSession, type Session } from '../../auth/session';
import * as guest from '../../transactions/api/guestBookApi';
import { getCategoryBudgets } from '../utils/categoryBudgets';
import type { BudgetInput, MonthBudget } from '../types';

const path = (session: Session, month: string) => {
  if (!session.bookId) throw new Error('Hãy chọn hoặc tạo sổ trong Cài đặt trước.');
  return `/books/${encodeURIComponent(session.bookId)}/budgets/${encodeURIComponent(month)}`;
};

export async function getBudget(
  month: string,
  session: Session | null = getSession(),
  signal?: AbortSignal,
): Promise<MonthBudget> {
  if (session) {
    return apiClient.get<MonthBudget>(path(session, month), {
      signal,
      accessToken: session.accessToken,
    });
  }
  const book = await guest.getBook();
  return {
    month,
    totalLimitVnd: book.budgets[month] ?? null,
    spentVnd: book.transactions
      .filter((row) => row.type === 'expense' && monthKey(row.date) === month)
      .reduce((sum, row) => sum + BigInt(row.amount), 0n)
      .toString(),
    categories: getCategoryBudgets(book, month).map((row) => ({
      categoryId:
        book.categoryDefinitions.find((category) => category.name === row.category)?.id ??
        row.category,
      categoryName: row.category,
      isActive: book.categoryDefinitions.some(
        (category) => category.name === row.category && category.isActive,
      ),
      limitVnd: row.hasLimit ? row.limit.toString() : null,
      spentVnd: row.spent.toString(),
    })),
  };
}

export async function updateBudget(input: BudgetInput, session: Session | null = getSession()) {
  if (!session) {
    if (input.amount === null) return guest.removeBudget(input);
    return guest.updateBudget({ ...input, amount: input.amount });
  }
  const url = path(session, input.month);
  const options = { accessToken: session.accessToken };
  if (input.categoryId) {
    const categoryPath = `${url}/categories/${encodeURIComponent(input.categoryId)}`;
    return input.amount === null
      ? apiClient.delete<MonthBudget>(categoryPath, options)
      : apiClient.put<MonthBudget>(categoryPath, { limitVnd: input.amount }, options);
  }
  if (input.category !== undefined)
    throw new Error('Không tìm thấy mã danh mục. Hãy tải lại dữ liệu.');
  return apiClient.put<MonthBudget>(url, { totalLimitVnd: input.amount }, options);
}

export async function copyPreviousBudget(month: string, session: Session | null = getSession()) {
  if (session) {
    try {
      return await apiClient.post<MonthBudget>(
        `${path(session, month)}/copy-previous`,
        {},
        {
          accessToken: session.accessToken,
        },
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        throw new Error(
          'Tháng trước chưa có hạn mức để sao chép hoặc tháng này đã có ngân sách. Hãy tải lại dữ liệu.',
          { cause: error },
        );
      }
      throw error;
    }
  }
  return guest.copyPreviousBudget(month);
}
