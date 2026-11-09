import type { Session } from '../auth/session';

export const budgetKeys = {
  book: (session: Session | null) =>
    ['budgets', session?.user.id ?? 'guest', session?.bookId ?? 'local'] as const,
  month: (session: Session | null, month: string) => [...budgetKeys.book(session), month] as const,
  update: ['budgets', 'update'] as const,
  copy: ['budgets', 'copy'] as const,
};
