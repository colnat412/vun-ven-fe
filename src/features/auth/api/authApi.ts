import { apiClient } from '@/lib/apiClient';
import { getAccountBooks } from '../../books/api/booksApi';
import type { Session } from '../session';
import type { LoginInput, RegisterInput } from '../types';

export const registerAccount = (input: RegisterInput) =>
  apiClient.post<unknown>('/auth/register', input, { accessToken: null });

export const updateProfile = (displayName: string, accessToken: string) =>
  apiClient.patch<Session['user']>('/auth/me', { displayName }, { accessToken });

export async function authenticate(input: LoginInput): Promise<Session> {
  const auth = await apiClient.post<{ accessToken: string }>('/auth/login', input, {
    accessToken: null,
  });
  const session: Session = {
    accessToken: auth.accessToken,
    user: { id: '', displayName: '', email: '' },
    bookId: '',
  };
  session.user = await apiClient.get<Session['user']>('/auth/me', {
    accessToken: session.accessToken,
  });
  const books = await getAccountBooks(session);
  session.bookId = books[0]?.id ?? '';
  return session;
}
