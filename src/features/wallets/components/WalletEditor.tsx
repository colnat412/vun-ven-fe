import { useRef, useState, type FormEvent } from 'react';
import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import Modal from '@/base/ui/Modal';
import SelectField from '@/base/ui/SelectField';
import type { WalletDefinition, WalletKind } from '../../transactions/types';
import { useChangeWallet } from '../hooks/useChangeWallet';
import { walletKinds } from '../constants';
import useUnsavedChanges from '@/base/hooks/useUnsavedChanges';
import { GENERIC_API_ERROR_MESSAGE } from '@/base/api/httpClient';
import WalletIconPicker from './WalletIconPicker';
import WalletIcon from './WalletIcon';
import { defaultWalletIcon, inferWalletBrand, walletBrands } from '../walletIcons';

type Props = { wallet?: WalletDefinition; wallets: WalletDefinition[]; onClose: () => void };
const WalletEditor = ({ wallet, wallets, onClose }: Props) => {
  const [name, setName] = useState(wallet?.name ?? '');
  const [kind, setKind] = useState<WalletKind>(wallet?.kind ?? 'bank');
  const [icon, setIcon] = useState(
    wallet?.icon ??
      inferWalletBrand(wallet?.name ?? '', wallet?.kind)?.id ??
      defaultWalletIcon(wallet?.kind ?? 'bank'),
  );
  const initialIcon =
    wallet?.icon ??
    inferWalletBrand(wallet?.name ?? '', wallet?.kind)?.id ??
    defaultWalletIcon(wallet?.kind ?? 'bank');
  const [error, setError] = useState('');
  const selectedBrand = walletBrands.find((row) => row.id === icon && row.kind === kind);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const submitting = useRef(false);
  const mutation = useChangeWallet();
  const canArchive = wallet?.isActive && wallets.filter((row) => row.isActive).length > 1;
  const guard = useUnsavedChanges(
    name !== (wallet?.name ?? '') || kind !== (wallet?.kind ?? 'bank') || icon !== initialIcon,
    mutation.isPending,
  );
  const done = () => {
    guard.allowNavigation();
    onClose();
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    const value = selectedBrand?.name ?? name.trim();
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
      await mutation.mutateAsync({ action: 'save', name: value, kind, icon, id: wallet?.id });
      done();
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
      done();
    } catch {
      /* The shared client provides the UI error. */
    } finally {
      submitting.current = false;
    }
  };
  return (
    <div className="stack">
      {guard.confirmation}
      {confirmArchive ? (
        <Modal
          title="Ngừng dùng ví"
          onClose={() => {
            if (!mutation.isPending) setConfirmArchive(false);
          }}
        >
          <div className="stack">
            <p>
              Ngừng dùng “{wallet?.name}” cho giao dịch mới? Lịch sử giao dịch vẫn được giữ lại.
            </p>
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
        </Modal>
      ) : (
        <form className="stack" onSubmit={submit}>
          <SelectField
            label="Loại"
            value={kind}
            options={(Object.keys(walletKinds) as WalletKind[]).map((value) => ({
              value,
              label: walletKinds[value],
            }))}
            onValueChange={(value) => {
              const next = value as WalletKind;
              if (next === kind) return;
              if (name === walletBrands.find((row) => row.id === icon)?.name) setName('');
              setKind(next);
              setIcon(defaultWalletIcon(next));
              setError('');
              mutation.reset();
            }}
            disabled={mutation.isPending}
          />
          <WalletIconPicker
            kind={kind}
            value={icon}
            disabled={mutation.isPending}
            onChange={(value, brandName) => {
              const previousBrand = walletBrands.find((row) => row.id === icon);
              if (brandName) setName(brandName);
              else if (name === previousBrand?.name) setName('');
              setIcon(value);
              setError('');
              mutation.reset();
            }}
          />
          {!selectedBrand && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <WalletIcon wallet={{ name, kind, icon }} size={36} />
              <span className="min-w-0 break-words text-sm">
                {selectedBrand?.name ?? (name.trim() || walletKinds[kind])}
              </span>
            </div>
          )}
          {!selectedBrand && (
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
          )}
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={!selectedBrand && !name.trim()}
          >
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
          {error || GENERIC_API_ERROR_MESSAGE}
        </p>
      )}
    </div>
  );
};
export default WalletEditor;
