import { useSyncExternalStore } from 'react';
import queryClient from '../../app/queryClient';

export type Session = {
  accessToken: string;
  user: { id: string; displayName: string; email: string };
  bookId: string;
};
const key = 'vunven.account.session';
function restore(): Session | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    return saved &&
      typeof saved.accessToken === 'string' &&
      typeof saved.user?.id === 'string' &&
      typeof saved.user?.email === 'string' &&
      typeof saved.user?.displayName === 'string' &&
      typeof saved.bookId === 'string'
      ? saved
      : null;
  } catch {
    return null;
  }
}
let session = restore();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getSession = () => session;
export const useSession = () => useSyncExternalStore(subscribe, getSession);
export function updateSessionUser(user: Session['user'], accessToken: string) {
  if (!session || session.accessToken !== accessToken || session.user.id !== user.id) return;
  session = { ...session, user };
  try {
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch {
    /* The current tab can still use an in-memory session. */
  }
  listeners.forEach((listener) => listener());
}
export function setSession(next: Session | null) {
  session = next;
  try {
    if (next) sessionStorage.setItem(key, JSON.stringify(next));
    else sessionStorage.removeItem(key);
  } catch {
    /* The current tab can still use an in-memory session. */
  }
  void queryClient.cancelQueries();
  queryClient.clear();
  listeners.forEach((listener) => listener());
}
