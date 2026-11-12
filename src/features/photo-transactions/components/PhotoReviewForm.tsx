import { useState, type FormEvent } from 'react';
import Button from '@/base/ui/Button';
import MoneyInput from '@/base/ui/MoneyInput';
import Input from '@/base/ui/Input';
import SelectField from '@/base/ui/SelectField';
import CategoryIcon from '../../transactions/components/CategoryIcon';
import DatePicker from '@/base/ui/DatePicker';
import { amountError } from '@/base/utils/amountValidation';
import { isValidDate, isValidTime } from '@/base/utils/date';
import useTransactionForm from '../../transactions/hooks/useTransactionForm';
import type { Book } from '../../transactions/types';
import type { PhotoDraft } from '../api/photoTransactionApi';

type Props = {
  photo: string;
  draft: PhotoDraft | null;
  book: Book;
  onSaved: () => void;
  onBusyChange: (busy: boolean) => void;
};

const PhotoReviewForm = ({ photo, draft, book, onSaved, onBusyChange }: Props) => {
  const categories = book.categoryOptions ?? [];
  const wallets = book.walletOptions ?? [];
  const [requestId] = useState(() => crypto.randomUUID());
  const [kindConfirmed, setKindConfirmed] = useState(!!draft?.kind);
  const [kindError, setKindError] = useState('');
  const [attempted, setAttempted] = useState(false);
  const form = useTransactionForm({
    initialValues: {
      amount: draft?.amountVnd ?? '',
      type: draft?.kind ?? 'expense',
      note: draft?.note ?? '',
      category: categories.includes(draft?.categoryName ?? '')
        ? draft!.categoryName!
        : categories[0],
      wallet: wallets.includes(draft?.walletName ?? '')
        ? draft!.walletName!
        : wallets.includes(book.transactions[0]?.wallet)
          ? book.transactions[0].wallet
          : wallets[0],
      photoDataUrl: photo,
      clientRequestId: requestId,
    },
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!kindConfirmed) {
      setKindError('Hãy chọn khoản chi hoặc khoản thu.');
      return;
    }
    if (
      amountError(form.values.amount, 1n) ||
      !isValidDate(form.values.date) ||
      !isValidTime(form.values.time)
    ) {
      await form.submit();
      return;
    }
    setAttempted(true);
    onBusyChange(true);
    try {
      if (await form.submit()) onSaved();
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <form className="stack" onSubmit={submit}>
      {!draft?.amountVnd && (
        <p className="small muted">
          Chưa đọc được số tiền từ ảnh. Bạn nhập số tiền để tiếp tục nhé.
        </p>
      )}
      {draft?.hasMultipleTransactions && (
        <p role="status" className="small muted">
          Ảnh có nhiều giao dịch. Mỗi lần lưu một khoản; hãy kiểm tra và nhập khoản bạn muốn ghi.
        </p>
      )}
      <fieldset disabled={form.isSaving || attempted} className="grid min-w-0 gap-4">
        <legend className="sr-only">Thông tin giao dịch</legend>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Loại giao dịch">
          {(['expense', 'income'] as const).map((kind) => (
            <Button
              key={kind}
              variant={kindConfirmed && form.values.type === kind ? 'primary' : 'secondary'}
              aria-pressed={kindConfirmed && form.values.type === kind}
              onClick={() => {
                setKindConfirmed(true);
                setKindError('');
                form.setField('type', kind);
              }}
            >
              {kind === 'expense' ? 'Khoản chi' : 'Khoản thu'}
            </Button>
          ))}
        </div>
        <MoneyInput
          label="Số tiền (VND)"
          minimum={1n}
          value={form.values.amount}
          onValueChange={(value) => form.setField('amount', value)}
          required
          autoFocus={!draft?.amountVnd}
        />
        <SelectField
          label="Danh mục"
          value={form.values.category}
          options={categories.map((category) => ({
            value: category,
            label: category,
            icon: <CategoryIcon category={category} />,
          }))}
          onValueChange={(value) => form.setField('category', value)}
        />
        <SelectField
          label={form.values.type === 'expense' ? 'Thanh toán bằng' : 'Nhận tiền vào'}
          value={form.values.wallet}
          options={wallets}
          onValueChange={(value) => form.setField('wallet', value)}
        />
        <details
          className="rounded-xl border border-border p-4"
          open={draft?.dateText ? true : undefined}
        >
          <summary className="cursor-pointer text-sm font-semibold">
            Chi tiết: ngày và ghi chú
          </summary>
          <div className="mt-4 grid gap-4">
            {draft?.dateText && (
              <p className="small muted">
                Ngày trên ảnh: {draft.dateText}. Hãy chọn lại ngày bên dưới nếu cần.
              </p>
            )}
            <DatePicker
              label="Ngày giao dịch"
              value={form.values.date}
              onValueChange={(value) => form.setField('date', value)}
            />
            <Input
              label="Giờ giao dịch"
              type="time"
              value={form.values.time}
              onChange={(event) => form.setField('time', event.target.value)}
              required
            />
            <Input
              label="Ghi chú"
              value={form.values.note}
              maxLength={160}
              onChange={(event) => form.setField('note', event.target.value)}
            />
            {/* <p className="small muted">Giờ Việt Nam (UTC+7)</p> */}
          </div>
        </details>
      </fieldset>
      {(kindError || form.error) && (
        <p role="alert" className="field-error">
          {kindError || form.error}
        </p>
      )}
      {attempted && !form.isSaving && (
        <p className="small muted">
          Bấm lưu lại để kiểm tra và hoàn tất cùng giao dịch, tránh ghi trùng.
        </p>
      )}
      <Button type="submit" isLoading={form.isSaving}>
        {attempted && !form.isSaving ? 'Thử lưu lại' : 'Lưu giao dịch'}
      </Button>
    </form>
  );
};
export default PhotoReviewForm;
