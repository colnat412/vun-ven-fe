import { apiClient } from '@/lib/apiClient';
import type { Session } from '../../auth/session';
import type { AccountBook, CreateBookInput } from '../types';

export const getAccountBooks = (session: Session, signal?: AbortSignal) =>
  apiClient.get<AccountBook[]>('/books', { signal, accessToken: session.accessToken });

export const createAccountBook = (input: CreateBookInput, session: Session) =>
  apiClient.post<AccountBook>('/books', input, { accessToken: session.accessToken });
