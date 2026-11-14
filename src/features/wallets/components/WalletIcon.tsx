import { useState } from 'react';
import { walletBrandMarks } from '../walletBrandMarks';
import type { WalletDefinition } from '../../transactions/types';
import {
  defaultWalletIcon,
  inferWalletBrand,
  walletBrands,
  walletIconOptions,
} from '../walletIcons';

export default function WalletIcon({
  wallet,
  size = 20,
}: {
  wallet: Pick<WalletDefinition, 'name' | 'kind' | 'icon'>;
  size?: number;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const selected = wallet.icon ?? inferWalletBrand(wallet.name, wallet.kind)?.id;
  const brand = walletBrands.find((row) => row.id === selected && row.kind === wallet.kind);
  const source = brand
    ? [walletBrandMarks[brand.id], `/wallet-icons/${brand.id}.png`].find(
        (path) => path && !failedSources.includes(path),
      )
    : undefined;
  if (source)
    return (
      <img
        src={source}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className="shrink-0 rounded bg-white object-contain"
        style={{ width: size, height: size }}
        onError={() => setFailedSources((previous) => [...previous, source])}
      />
    );
  const Icon = (walletIconOptions.find((row) => row.id === selected) ??
    walletIconOptions.find((row) => row.id === defaultWalletIcon(wallet.kind)))!.Icon;
  return (
    <Icon size={size} strokeWidth={1.7} className="shrink-0 text-primary" aria-hidden="true" />
  );
}
