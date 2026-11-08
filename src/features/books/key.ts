export const bookKeys = {
  all: ['account-books'] as const,
  list: (userId?: string) => [...bookKeys.all, userId] as const,
  create: ['account-books', 'create'] as const,
};
