import { useRef, useState, type FormEvent } from 'react';
import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import Modal from '@/base/ui/Modal';
import SelectField from '@/base/ui/SelectField';
import type { WalletDefinition, WalletKind } from '../../transactions/types';
import { useChangeWallet } from '../hooks/useChangeWallet';
import { walletKinds } from '../constants';

type Props = { wallet?: WalletDefinition; wallets: WalletDefinition[]; onClose: () => void };
const WalletEditor = ({ wallet, wallets, onClose }: Props) => {
  const [name, setName] = useState(wallet?.name ?? '');
  const [kind, setKind] = useState<WalletKind>(wallet?.kind ?? 'bank');
  const [error, setError] = useState('');
  const [confirmArchive, setConfirmArchive] = useState(false);
  const submitting = useRef(false);
  const mutation = useChangeWallet();
  const canArchive = wallet?.isActive && wallets.filter((row) => row.isActive).length > 1;
  const close = () => {
    if (!submitting.current) onClose();
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    const value = name.trim();
    if (!value || value.length > 120) {
      setError('Tên cần từ 1 đến 120 ký tự.');
      return;
    }
    if (
      wallets.some(
        (row) =>
          row.id !== wallet?.id &&
          row.name.toLocaleLowerCase('vi') === value.toLocaleLowerCase('vi') &&
          (wallet || row.isActive),
      )
    ) {
      setError('Tên ngân hàng hoặc ví đã tồn tại.');
      return;
    }
    submitting.current = true;
    try {
      await mutation.mutateAsync({ action: 'save', name: value, kind, id: wallet?.id });
      onClose();
    } catch {
      /* The shared client provides the UI error. */
    } finally {
      submitting.current = false;
    }
  };
  const archive = async () => {
    if (!wallet || submitting.current) return;
    submitting.current = true;
    try {
      await mutation.mutateAsync({ action: 'archive', id: wallet.id });
      onClose();
    } catch {
      /* The shared client provides the UI error. */
    } finally {
      submitting.current = false;
    }
  };
  return (
    <Modal
      title={
        confirmArchive
          ? 'Ngừng dùng ví'
          : wallet
            ? 'Điều chỉnh ngân hàng / ví'
            : 'Thêm ngân hàng / ví'
      }
      onClose={close}
    >
      {confirmArchive ? (
        <div className="stack">
          <p>Ngừng dùng “{wallet?.name}” cho giao dịch mới? Lịch sử giao dịch vẫn được giữ lại.</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => setConfirmArchive(false)}
            >
              Hủy
            </Button>
            <Button
              isLoading={mutation.isPending}
              onClick={() => {
                void archive();
              }}
            >
              Ngừng dùng
            </Button>
          </div>
        </div>
      ) : (
        <form className="stack" onSubmit={submit}>
          <Input
            label="Tên ngân hàng / ví"
            placeholder="Ví dụ: Vietcombank, MoMo, ZaloPay"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
              mutation.reset();
            }}
            maxLength={120}
            required
            autoFocus
            disabled={mutation.isPending}
          />
          <SelectField
            label="Loại"
            value={walletKinds[kind]}
            options={Object.values(walletKinds)}
            onValueChange={(value) =>
              setKind(
                (Object.keys(walletKinds) as WalletKind[]).find(
                  (key) => walletKinds[key] === value,
                )!,
              )
            }
            disabled={mutation.isPending}
          />
          <Button type="submit" isLoading={mutation.isPending} disabled={!name.trim()}>
            {wallet?.isActive === false ? 'Dùng lại ví này' : wallet ? 'Lưu thay đổi' : 'Thêm ví'}
          </Button>
          {wallet?.isActive && (
            <Button
              variant="ghost"
              disabled={!canArchive || mutation.isPending}
              onClick={() => {
                setConfirmArchive(true);
                mutation.reset();
              }}
            >
              Ngừng dùng
            </Button>
          )}
          {wallet?.isActive && !canArchive && (
            <p className="small muted">Cần giữ ít nhất một ví đang dùng.</p>
          )}
        </form>
      )}
      {(error || mutation.error) && (
        <p role="alert" className="field-error">
          {error || mutation.error?.message}
        </p>
      )}
    </Modal>
  );
};
export default WalletEditor;
