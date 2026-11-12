import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { apiClient } from '@/lib/apiClient';
import type { Session } from '../../auth/session';

export type PhotoDraft = {
  amountVnd: string | null;
  kind: 'income' | 'expense' | null;
  categoryName: string | null;
  walletName: string | null;
  note: string;
  dateText: string | null;
  hasMultipleTransactions: boolean;
};

export async function parsePhoto(photoDataUrl: string, session: Session, signal: AbortSignal) {
  const draft = await apiClient.post<PhotoDraft>(
    `/books/${encodeURIComponent(session.bookId)}/quick-transactions/parse-photo`,
    { photoDataUrl },
    { accessToken: session.accessToken, signal },
  );
  if (
    !draft ||
    ![null, 'income', 'expense'].includes(draft.kind) ||
    typeof draft.note !== 'string' ||
    draft.note.length > 160 ||
    typeof draft.hasMultipleTransactions !== 'boolean' ||
    ![draft.categoryName, draft.walletName, draft.dateText].every(
      (value) => value === null || typeof value === 'string',
    ) ||
    (draft.amountVnd !== null &&
      (typeof draft.amountVnd !== 'string' ||
        !/^[1-9]\d{0,12}$/.test(draft.amountVnd) ||
        BigInt(draft.amountVnd) > 1000000000000n))
  ) {
    throw new Error(GENERIC_API_ERROR_MESSAGE);
  }
  return draft;
}
