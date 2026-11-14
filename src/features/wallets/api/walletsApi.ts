import { apiClient } from '@/lib/apiClient';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import type { Session } from '../../auth/session';
import type { WalletKind } from '../../transactions/types';
import * as guest from '../../transactions/api/guestBookApi';

export type WalletChange =
  | { action: 'save'; name: string; kind: WalletKind; id?: string; icon?: string | null }
  | { action: 'archive'; id: string };
export async function changeWallet(change: WalletChange, session: Session | null) {
  if (!session) {
    return change.action === 'save'
      ? guest.saveWallet(change.name, change.kind, change.id, change.icon)
      : guest.archiveWallet(change.id);
  }
  if (!session.bookId) throw new Error(GENERIC_API_ERROR_MESSAGE);
  const path = `/books/${encodeURIComponent(session.bookId)}/wallets`;
  const options = { accessToken: session.accessToken };
  if (change.action === 'archive')
    return apiClient.delete(path + '/' + encodeURIComponent(change.id), options);
  const body = { name: change.name, kind: change.kind, icon: change.icon };
  return change.id
    ? apiClient.put(path + '/' + encodeURIComponent(change.id), body, options)
    : apiClient.post(path, body, options);
}
