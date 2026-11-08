import { isValidDateTime, toDateTime } from '../../../base/utils/date';
import { categories, wallets } from '../constants';
import type { Book, Category, CategoryDefinition, Transaction, TransactionInput } from '../types';

const storageKey = 'hu.demo.book.v1';
const validCategoryName = (name: unknown): name is string =>
  typeof name === 'string' && name.trim().length > 0 && name.length <= 120;
const definitions = (book: Book): CategoryDefinition[] =>
  book.categoryDefinitions ??
  categories.map((name, index) => ({ id: 'default-' + index, name, isActive: true }));
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
    validCategoryName(row.category) &&
    wallets.includes(row.wallet as string) &&
    isValidDateTime(row.date) &&
    (row.type === 'expense' || row.type === 'income')
  );
};

const seedBook = (): Book => ({ version: 1, transactions: [], budgets: {} });

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
            ([category, amount]) => validCategoryName(category) && validAmount(amount),
          ),
      ))
  ) {
    throw new Error('Hạn mức danh mục trên thiết bị không đúng định dạng.');
  }
  if (
    data.categoryDefinitions !== undefined &&
    (!Array.isArray(data.categoryDefinitions) ||
      !data.categoryDefinitions.every(
        (row) =>
          row &&
          typeof row.id === 'string' &&
          validCategoryName(row.name) &&
          typeof row.isActive === 'boolean',
      ) ||
      new Set(data.categoryDefinitions.map((row) => row.id)).size !==
        data.categoryDefinitions.length ||
      new Set(data.categoryDefinitions.map((row) => row.name.toLocaleLowerCase('vi'))).size !==
        data.categoryDefinitions.length)
  )
    throw new Error('Danh mục trên thiết bị không đúng định dạng.');
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

export const getBook = async () => {
  const book = readBook();
  return {
    ...book,
    categoryDefinitions: definitions(book),
    categoryOptions: definitions(book)
      .filter((row) => row.isActive)
      .map((row) => row.name),
  };
};

export const saveCategory = async (name: string, id?: string) => {
  name = name.trim();
  if (!validCategoryName(name)) throw new Error('Tên danh mục cần có từ 1 đến 120 ký tự.');
  const book = readBook();
  const rows = definitions(book);
  const duplicate = rows.find(
    (row) => row.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi') && row.id !== id,
  );
  if (duplicate && (id || duplicate.isActive)) throw new Error('Tên danh mục đã tồn tại.');
  const current = id ? rows.find((row) => row.id === id && row.isActive) : duplicate;
  if (id && !current) throw new Error('Không tìm thấy danh mục.');
  const category = { id: current?.id ?? crypto.randomUUID(), name, isActive: true };
  const categoryBudgets =
    book.categoryBudgets &&
    Object.fromEntries(
      Object.entries(book.categoryBudgets).map(([month, limits]) => [
        month,
        Object.fromEntries(
          Object.entries(limits).map(([key, value]) => [key === current?.name ? name : key, value]),
        ),
      ]),
    );
  return writeBook({
    ...book,
    categoryDefinitions: current
      ? rows.map((row) => (row.id === current.id ? category : row))
      : [...rows, category],
    transactions: book.transactions.map((row) =>
      row.category === current?.name ? { ...row, category: name } : row,
    ),
    ...(categoryBudgets ? { categoryBudgets } : {}),
  });
};

export const deleteCategory = async (id: string) => {
  const book = readBook();
  const rows = definitions(book);
  if (!rows.some((row) => row.id === id && row.isActive))
    throw new Error('Không tìm thấy danh mục.');
  return writeBook({
    ...book,
    categoryDefinitions: rows.map((row) => (row.id === id ? { ...row, isActive: false } : row)),
  });
};
export const deleteTransaction = async (id: string) => {
  const book = readBook();
  if (!book.transactions.some((row) => row.id === id)) throw new Error('Không tìm thấy giao dịch.');
  return writeBook({ ...book, transactions: book.transactions.filter((row) => row.id !== id) });
};
export const updateTransaction = async (id: string, input: TransactionInput) => {
  const book = readBook();
  if (!definitions(book).some((row) => row.isActive && row.name === input.category))
    throw new Error('Danh mục không còn hoạt động.');
  if (!book.transactions.some((row) => row.id === id)) throw new Error('Không tìm thấy giao dịch.');
  const { time, ...fields } = input;
  const row = { ...fields, id, date: toDateTime(input.date, time), note: input.note.trim() };
  if (!validTransaction(row)) throw new Error('Thông tin giao dịch chưa hợp lệ.');
  return writeBook({
    ...book,
    transactions: book.transactions.map((item) => (item.id === id ? row : item)),
  });
};
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
  if (!definitions(book).some((row) => row.isActive && row.name === input.category))
    throw new Error('Danh mục không còn hoạt động.');
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
    (category !== undefined && !validCategoryName(category))
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
