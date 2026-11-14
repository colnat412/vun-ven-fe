import { Banknote, Building2, Coins, CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react';
import type { WalletKind } from '../transactions/types';

export const walletBrands: { id: string; name: string; kind: WalletKind; aliases?: string[] }[] = [
  { id: 'vcb', name: 'Vietcombank', kind: 'bank' },
  { id: 'mb', name: 'MB Bank', kind: 'bank', aliases: ['MBBank', 'MB'] },
  { id: 'tcb', name: 'Techcombank', kind: 'bank' },
  { id: 'acb', name: 'ACB', kind: 'bank' },
  { id: 'bidv', name: 'BIDV', kind: 'bank' },
  { id: 'icb', name: 'VietinBank', kind: 'bank', aliases: ['Viettinbank'] },
  { id: 'vpb', name: 'VPBank', kind: 'bank' },
  { id: 'vib', name: 'VIB', kind: 'bank' },
  { id: 'vba', name: 'Agribank', kind: 'bank' },
  { id: 'tpb', name: 'TPBank', kind: 'bank' },
  { id: 'stb', name: 'Sacombank', kind: 'bank' },
  { id: 'hdb', name: 'HDBank', kind: 'bank' },
  { id: 'ocb', name: 'OCB', kind: 'bank' },
  { id: 'shb', name: 'SHB', kind: 'bank' },
  { id: 'msb', name: 'MSB', kind: 'bank' },
  { id: 'eib', name: 'Eximbank', kind: 'bank' },
  { id: 'lpb', name: 'LPBank', kind: 'bank' },
  { id: 'momo', name: 'MoMo', kind: 'ewallet' },
  { id: 'zalopay', name: 'ZaloPay', kind: 'ewallet' },
  { id: 'shopeepay', name: 'ShopeePay', kind: 'ewallet' },
];

export const walletIconOptions = [
  { id: 'banknote', label: 'Tiền mặt', Icon: Banknote },
  { id: 'landmark', label: 'Ngân hàng', Icon: Landmark },
  { id: 'wallet', label: 'Ví', Icon: Wallet },
  { id: 'credit-card', label: 'Thẻ', Icon: CreditCard },
  { id: 'coins', label: 'Tiền xu', Icon: Coins },
  { id: 'smartphone', label: 'Điện thoại', Icon: Smartphone },
  { id: 'building', label: 'Tổ chức', Icon: Building2 },
];
export const defaultWalletIcon = (kind: WalletKind) =>
  kind === 'cash' ? 'banknote' : kind === 'bank' ? 'landmark' : 'wallet';
const normalize = (name: string) => name.toLocaleLowerCase('vi').replace(/\s+/g, '');
export const inferWalletBrand = (name: string, kind?: WalletKind) =>
  walletBrands.find(
    (brand) =>
      (!kind || brand.kind === kind) &&
      [brand.name, ...(brand.aliases ?? [])].some((alias) => normalize(alias) === normalize(name)),
  );
export const isWalletIcon = (value: unknown, kind: WalletKind): boolean =>
  value === undefined ||
  value === null ||
  walletIconOptions.some((option) => option.id === value) ||
  walletBrands.some((brand) => brand.id === value && brand.kind === kind);

export const walletSearchKeywords = (name: string) => {
  const brand = inferWalletBrand(name);
  return brand ? [brand.id, ...(brand.aliases ?? [])] : [];
};
