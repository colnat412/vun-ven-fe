export type QuickTransactionInput = {
  kind: 'income' | 'expense';
  amountVnd: string;
  categoryId: string;
  walletId: string;
  note: string;
  occurredAt: string;
};

export type QuickParseResult =
  | {
      status: 'ready';
      transaction: QuickTransactionInput;
      display: { categoryName: string; walletName: string };
    }
  | { status: 'needs_input'; reason: string; message: string };

export type QuickSaveResult =
  { status: 'saved' } | Extract<QuickParseResult, { status: 'needs_input' }>;
