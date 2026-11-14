import { useBook } from '../../transactions/hooks/useBook';
import { inferWalletBrand } from '../walletIcons';
import WalletIcon from './WalletIcon';

export default function PaymentMethodIcon({ name, size = 20 }: { name: string; size?: number }) {
  const book = useBook();
  const wallet = book.data?.walletDefinitions?.find((row) => row.name === name);
  const fallback = {
    name,
    kind: inferWalletBrand(name)?.kind ?? (name === 'Tiền mặt' ? 'cash' : 'bank'),
  } as const;
  return <WalletIcon wallet={wallet ?? fallback} size={size} />;
}
