import { ApiError, GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import { apiClient } from '@/lib/apiClient';
import { getSession, type Session } from '../../auth/session';
import type { QuickParseResult, QuickSaveResult } from '../types';

export class QuickSaveUncertainError extends Error {
  constructor() {
    super(GENERIC_API_ERROR_MESSAGE);
    this.name = 'QuickSaveUncertainError';
  }
}

export async function createQuickTransaction(
  text: string,
  session: Session | null,
  walletId?: string,
): Promise<QuickSaveResult> {
  if (!session) throw new Error('Hãy đăng nhập để sử dụng Ghi nhanh bằng AI.');
  if (!session.bookId) throw new Error('Hãy chọn hoặc tạo sổ trong Cài đặt trước.');
  const content = text.trim();
  if (!content || content.length > 500) throw new Error('Nhập nội dung từ 1 đến 500 ký tự.');
  const path = '/books/' + encodeURIComponent(session.bookId);
  const options = { accessToken: session.accessToken };
  const parsed = await apiClient.post<QuickParseResult>(
    path + '/quick-transactions/parse',
    { text: content, ...(walletId ? { walletId } : {}) },
    options,
  );
  if (parsed.status === 'needs_input') return parsed;
  // A request already in flight must never save under a different account/book.
  const current = getSession();
  if (current?.accessToken !== session.accessToken || current?.bookId !== session.bookId) {
    throw new Error('Phiên đăng nhập hoặc sổ đã thay đổi. Hãy mở lại Ghi nhanh.');
  }
  try {
    await apiClient.post(path + '/transactions', parsed.transaction, options);
  } catch (error) {
    // No automatic retry: a lost response may follow a successful database commit.
    if (!(error instanceof ApiError) || error.status >= 500 || error.status === 408) {
      throw new QuickSaveUncertainError();
    }
    throw error;
  }
  return { status: 'saved' };
}
