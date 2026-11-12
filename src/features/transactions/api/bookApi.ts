import { toDateTime } from '../../../base/utils/date';
import { apiClient } from '@/lib/apiClient';
import { getSession, type Session } from '../../auth/session';
import type { Book, Transaction, TransactionInput, WalletDefinition } from '../types';
import * as guest from './guestBookApi';

type ServerCategory = { id: string; name: string; code: string; isActive: boolean };
type ServerWallet = WalletDefinition;
type ServerBook = { id: string; categories: ServerCategory[]; wallets: ServerWallet[] };
type ServerTransaction = {
  id: string;
  kind: Transaction['type'];
  amountVnd: string;
  note: string;
  occurredOn: string;
  occurredAt: string | null;
  categoryCode: string;
  categoryName: string;
  walletName: string;
  hasPhoto?: boolean | number | string;
};
type Page = { items: ServerTransaction[]; total: number; page: number; limit: number };
const bookPath = (session: Session) => '/books/' + encodeURIComponent(session.bookId);

export async function getBook(
  session: Session | null = getSession(),
  signal?: AbortSignal,
): Promise<Book> {
  if (!session) return guest.getBook();
  if (!session.bookId)
    return {
      version: 1,
      source: 'server',
      transactions: [],
      budgets: {},
      categoryOptions: [],
      walletOptions: [],
    };
  const book = await apiClient.get<ServerBook>(bookPath(session), {
    signal,
    accessToken: session.accessToken,
  });
  // The existing overview computes totals on the client: load every page, never a partial total.
  const transactions: Transaction[] = [];
  const seen = new Set<string>();
  for (let page = 1; ; page++) {
    const result = await apiClient.get<Page>(
      bookPath(session) + '/transactions?limit=100&page=' + page,
      { signal, accessToken: session.accessToken },
    );
    for (const row of result.items) {
      if (seen.has(row.id)) throw new Error('Danh sách đang thay đổi. Hãy tải lại dữ liệu.');
      seen.add(row.id);
      transactions.push({
        id: row.id,
        type: row.kind,
        amount: row.amountVnd,
        note: row.note,
        category: row.categoryName,
        wallet: row.walletName,
        date: row.occurredAt ?? row.occurredOn,
        hasPhoto: row.hasPhoto === true || row.hasPhoto === 1 || row.hasPhoto === '1',
      });
    }
    if (transactions.length >= result.total) break;
    if (!result.items.length) throw new Error('Chưa tải đủ giao dịch. Hãy tải lại dữ liệu.');
  }
  return {
    version: 1,
    source: 'server',
    transactions,
    budgets: {},
    categoryDefinitions: book.categories,
    categoryOptions: book.categories.filter((row) => row.isActive).map((row) => row.name),
    walletOptions: book.wallets.filter((row) => row.isActive).map((row) => row.name),
    walletDefinitions: book.wallets,
  };
}
async function saveTransaction(input: TransactionInput, session: Session | null, id?: string) {
  if (!session) return id ? guest.updateTransaction(id, input) : guest.createTransaction(input);
  if (!session.bookId) throw new Error('Hãy chọn hoặc tạo sổ trong Cài đặt trước.');
  const book = await apiClient.get<ServerBook>(bookPath(session), {
    accessToken: session.accessToken,
  });
  const category = book.categories.find((row) => row.isActive && row.name === input.category);
  const wallet = book.wallets.find((row) => (row.isActive || !!id) && row.name === input.wallet);
  if (!category || !wallet)
    throw new Error('Danh mục hoặc ví không còn hoạt động. Hãy tải lại sổ.');
  const request = id ? apiClient.put : apiClient.post;
  return request<ServerTransaction>(
    bookPath(session) + '/transactions' + (id ? '/' + encodeURIComponent(id) : ''),
    {
      kind: input.type,
      amountVnd: input.amount,
      categoryId: category.id,
      walletId: wallet.id,
      note: input.note.trim(),
      occurredAt: toDateTime(input.date, input.time),
      ...(!id && input.photoDataUrl ? { photoDataUrl: input.photoDataUrl } : {}),
      ...(!id && input.clientRequestId ? { clientRequestId: input.clientRequestId } : {}),
    },
    { accessToken: session.accessToken },
  );
}
export const createTransaction = (
  input: TransactionInput,
  session: Session | null = getSession(),
) => saveTransaction(input, session);
export const updateTransaction = (
  id: string,
  input: TransactionInput,
  session: Session | null = getSession(),
) => saveTransaction(input, session, id);

export async function deleteTransaction(id: string, session: Session | null = getSession()) {
  if (!session) return guest.deleteTransaction(id);
  if (!session.bookId) throw new Error('Hãy chọn hoặc tạo sổ trong Cài đặt trước.');
  await apiClient.delete<void>(bookPath(session) + '/transactions/' + encodeURIComponent(id), {
    accessToken: session.accessToken,
  });
}
