import { currentMonth, today, isValidDateTime, toDateTime } from '../../../shared/utils/date';
import { categories, wallets } from '../constants';
import type { Book, Category, Transaction, TransactionInput } from '../types';

const storageKey = 'hu.demo.book.v1';
const validAmount = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{1,13}$/.test(value) && BigInt(value) <= 1000000000000n;
const validTransaction = (value: unknown): value is Transaction => {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    validAmount(row.amount) &&
    BigInt(row.amount) > 0n &&
    typeof row.note === 'string' &&
    row.note.length <= 160 &&
    categories.includes(row.category as Transaction['category']) &&
    wallets.includes(row.wallet as string) &&
    isValidDateTime(row.date) &&
    (row.type === 'expense' || row.type === 'income')
  );
};

const seedBook = (): Book => {
  const month = currentMonth();
  const day = today();
  const rows: Transaction[] = [
    {
      id: 'sample-1',
      amount: '65000',
      note: 'Bữa trưa cùng đồng nghiệp',
      category: 'Ăn uống',
      wallet: 'Chuyển khoản',
      date: toDateTime(day, '12:15'),
      type: 'expense',
    },
    {
      id: 'sample-2',
      amount: '35000',
      note: 'Cà phê sáng',
      category: 'Ăn uống',
      wallet: 'Tiền mặt',
      date: toDateTime(day, '08:30'),
      type: 'expense',
    },
    {
      id: 'sample-3',
      amount: '83000',
      note: 'Đổ xăng',
      category: 'Di chuyển',
      wallet: 'Chuyển khoản',
      date: toDateTime(`${month}-01`, '17:45'),
      type: 'expense',
    },
  ];
  return { version: 1, transactions: rows, budgets: { [month]: '10000000' } };
};

const readBook = (): Book => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return seedBook();
  const data = JSON.parse(raw) as Book;
  // Keep books saved before the wallet label changed readable.
  if (Array.isArray(data?.transactions)) {
    data.transactions = data.transactions.map((row) =>
      row && typeof row === 'object' && row.wallet === 'Tài khoản ngân hàng'
        ? { ...row, wallet: 'Chuyển khoản' }
        : row,
    );
  }
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.transactions) ||
    !data.transactions.every(validTransaction) ||
    !data.budgets ||
    typeof data.budgets !== 'object' ||
    !Object.entries(data.budgets).every(
      ([month, amount]) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month) && validAmount(amount),
    )
  ) {
    throw new Error(
      'Dữ liệu trên thiết bị không đúng định dạng. Hãy xuất hoặc kiểm tra dữ liệu trước khi tiếp tục.',
    );
  }
  if (
    data.categoryBudgets !== undefined &&
    (!data.categoryBudgets ||
      typeof data.categoryBudgets !== 'object' ||
      Array.isArray(data.categoryBudgets) ||
      !Object.entries(data.categoryBudgets).every(
        ([month, limits]) =>
          /^\d{4}-(0[1-9]|1[0-2])$/.test(month) &&
          limits &&
          typeof limits === 'object' &&
          !Array.isArray(limits) &&
          Object.entries(limits).every(
            ([category, amount]) =>
              categories.includes(category as Category) && validAmount(amount),
          ),
      ))
  ) {
    throw new Error('Hạn mức danh mục trên thiết bị không đúng định dạng.');
  }
  return data;
};

const writeBook = (book: Book) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(book));
  } catch {
    throw new Error('Không lưu được trên trình duyệt. Hãy kiểm tra quyền lưu trữ hoặc dung lượng.');
  }
  return book;
};

export const getBook = async () => readBook();
export const createTransaction = async (input: TransactionInput) => {
  const { time, ...fields } = input;
  const row = {
    ...fields,
    date: toDateTime(input.date, time),
    id: crypto.randomUUID(),
    note: input.note.trim(),
  };
  if (!validTransaction(row)) throw new Error('Thông tin giao dịch chưa hợp lệ.');
  const book = readBook();
  return writeBook({ ...book, transactions: [row, ...book.transactions] });
};
export const updateBudget = async ({
  month,
  amount,
  category,
}: {
  month: string;
  amount: string;
  category?: Category;
}) => {
  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    !validAmount(amount) ||
    (category !== undefined && !categories.includes(category))
  )
    throw new Error('Ngân sách không hợp lệ.');
  const book = readBook();
  if (category !== undefined) {
    return writeBook({
      ...book,
      categoryBudgets: {
        ...book.categoryBudgets,
        [month]: { ...book.categoryBudgets?.[month], [category]: amount },
      },
    });
  }
  return writeBook({ ...book, budgets: { ...book.budgets, [month]: amount } });
};
export const exportBook = () => JSON.stringify(readBook(), null, 2);
