import { useRef, useState, type FormEvent } from 'react';
import PaymentMethodIcon from '../../wallets/components/PaymentMethodIcon';
import { walletSearchKeywords } from '../../wallets/walletIcons';
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Wallet } from 'lucide-react';
import Button from '@/base/ui/Button';
import MoneyInput from '@/base/ui/MoneyInput';
import Input from '@/base/ui/Input';
import SelectField from '@/base/ui/SelectField';
import DatePicker from '@/base/ui/DatePicker';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import useUnsavedChanges from '@/base/hooks/useUnsavedChanges';
import { amountError } from '@/base/utils/amountValidation';
import { isValidDate, isValidTime } from '@/base/utils/date';
import CategoryIcon from '../../transactions/components/CategoryIcon';
import useTransactionForm from '../../transactions/hooks/useTransactionForm';
import type { Book } from '../../transactions/types';
import PhotoCamera from './PhotoCamera';

type Props = { book: Book; onSaved: (date: string) => void };

export default function PhotoReviewForm({ book, onSaved }: Props) {
  const categories = book.categoryOptions ?? [];
  const wallets = book.walletOptions ?? [];
  const [requestId] = useState(() => crypto.randomUUID());
  const [attempted, setAttempted] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const submitting = useRef(false);
  const form = useTransactionForm({
    initialValues: {
      category: categories[0],
      wallet: wallets.includes(book.transactions[0]?.wallet)
        ? book.transactions[0].wallet
        : wallets[0],
      photoDataUrl: '',
      clientRequestId: requestId,
    },
  });
  const locked = attempted || form.isSaving;
  const [initialValues] = useState(form.values);
  const guard = useUnsavedChanges(
    JSON.stringify(form.values) !== JSON.stringify(initialValues),
    form.isSaving,
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || preparing || cameraActive) return;
    if (!form.values.photoDataUrl) {
      setPhotoError('Chụp hoặc chọn một ảnh trước khi lưu nhé.');
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
    submitting.current = true;
    setAttempted(true);
    try {
      if (await form.submit()) {
        guard.allowNavigation();
        onSaved(form.values.date);
      }
    } finally {
      submitting.current = false;
    }
  };

  return (
    <form className="photo-composer" onSubmit={submit}>
      {guard.confirmation}
      <fieldset disabled={locked} className="photo-composer__fields">
        <legend className="sr-only">Ảnh và thông tin thu chi</legend>
        <div className="photo-composer__frame">
          <PhotoCamera
            photo={form.values.photoDataUrl ?? ''}
            disabled={locked || preparing}
            onPreparing={setPreparing}
            onActiveChange={setCameraActive}
            onPhoto={(photo) => {
              form.setField('photoDataUrl', photo);
              setPhotoError('');
            }}
          />
          <div className="photo-composer__caption">
            <div className="photo-composer__kind" role="group" aria-label="Loại giao dịch">
              {(['expense', 'income'] as const).map((kind) => (
                <Button
                  key={kind}
                  type="button"
                  variant={form.values.type === kind ? 'primary' : 'ghost'}
                  aria-pressed={form.values.type === kind}
                  onClick={() => form.setField('type', kind)}
                >
                  {kind === 'expense' ? <ArrowUpRight size={19} /> : <ArrowDownLeft size={19} />}
                  {kind === 'expense' ? 'Chi' : 'Thu'}
                </Button>
              ))}
            </div>
            <div className="photo-composer__amount">
              <MoneyInput
                label="Số tiền (VND)"
                value={form.values.amount}
                minimum={1n}
                onValueChange={(value) => form.setField('amount', value)}
                placeholder="0"
                required
              />
              <span aria-hidden="true">₫</span>
            </div>
            <Input
              label="Mô tả"
              value={form.values.note}
              maxLength={160}
              placeholder="Thêm mô tả…"
              onChange={(event) => form.setField('note', event.target.value)}
            />
          </div>
        </div>
        <p className="photo-composer__hint" role="status">
          {preparing ? 'Đang chuẩn bị ảnh…' : 'Nhập số tiền, giữ lại khoảnh khắc.'}
        </p>
        <div className="photo-composer__destination">
          <div className="photo-composer__section-title">
            <Wallet size={18} />
            <span>Lưu khoản {form.values.type === 'expense' ? 'chi' : 'thu'} vào</span>
          </div>
          <div className="photo-composer__options">
            <SelectField
              label="Ví của bạn"
              searchable
              value={form.values.wallet}
              options={wallets.map((name) => ({
                value: name,
                label: name,
                keywords: walletSearchKeywords(name),
                icon: <PaymentMethodIcon name={name} size={24} />,
              }))}
              disabled={locked}
              onValueChange={(value) => form.setField('wallet', value)}
            />
            <SelectField
              label="Danh mục"
              value={form.values.category}
              disabled={locked}
              options={categories.map((category) => ({
                value: category,
                label: category,
                icon: <CategoryIcon category={category} />,
              }))}
              onValueChange={(value) => form.setField('category', value)}
            />
          </div>
        </div>
        <details className="photo-composer__details">
          <summary>
            Ngày & giờ giao dịch <ChevronDown size={16} />
          </summary>
          <div className="photo-composer__options">
            <DatePicker
              label="Ngày giao dịch"
              value={form.values.date}
              onValueChange={(value) => form.setField('date', value)}
            />
            <Input
              label="Giờ giao dịch"
              type="time"
              required
              value={form.values.time}
              onChange={(event) => form.setField('time', event.target.value)}
            />
          </div>
        </details>
      </fieldset>
      {(photoError || form.error) && (
        <p role="alert" className="field-error">
          {photoError || form.validationError || GENERIC_API_ERROR_MESSAGE}
        </p>
      )}
      {attempted && !form.isSaving && (
        <p className="small muted">Bấm lưu lại để hoàn tất cùng giao dịch, tránh ghi trùng.</p>
      )}
      <Button
        type="submit"
        className="photo-composer__save"
        disabled={preparing || cameraActive}
        isLoading={form.isSaving}
      >
        {attempted && !form.isSaving ? 'Thử lưu lại' : 'Lưu giao dịch'}
      </Button>
      <p className="photo-composer__footnote">Ảnh được lưu cùng giao dịch sau khi bạn bấm Lưu.</p>
    </form>
  );
}
