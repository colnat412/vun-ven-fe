import type { WalletKind } from '../transactions/types';

export const walletKinds: Record<WalletKind, string> = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  ewallet: 'Ví điện tử',
};
