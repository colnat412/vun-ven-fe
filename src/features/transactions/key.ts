import type { Session } from '../auth/session';
export const transactionKeys = {
  all: ['book'] as const,
  book: (session: Session | null) =>
    [...transactionKeys.all, session?.user.id ?? 'guest', session?.bookId ?? 'local'] as const,
  create: ['transactions', 'create'] as const,
  update: ['transactions', 'update'] as const,
  delete: ['transactions', 'delete'] as const,
};
