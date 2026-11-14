import Button from '@/base/ui/Button';
import SelectField from '@/base/ui/SelectField';
import type { WalletKind } from '../../transactions/types';
import { defaultWalletIcon, walletBrands, walletIconOptions } from '../walletIcons';
import WalletIcon from './WalletIcon';

type Props = {
  kind: WalletKind;
  value: string;
  disabled?: boolean;
  onChange: (icon: string, brandName?: string) => void;
};
export default function WalletIconPicker({ kind, value, disabled, onChange }: Props) {
  const brand = walletBrands.find((row) => row.id === value && row.kind === kind);
  return (
    <div className="stack">
      {kind !== 'cash' && (
        <SelectField
          searchable
          label={kind === 'bank' ? 'Ngân hàng' : 'Ví điện tử'}
          value={brand?.id ?? 'other'}
          disabled={disabled}
          options={[
            ...walletBrands
              .filter((row) => row.kind === kind)
              .map((row) => ({
                value: row.id,
                label: row.name,
                keywords: row.aliases,
                icon: <WalletIcon wallet={{ ...row, icon: row.id }} size={28} />,
              })),
            { value: 'other', label: kind === 'bank' ? 'Ngân hàng khác' : 'Ví khác' },
          ]}
          onValueChange={(id) => {
            const selected = walletBrands.find((row) => row.id === id);
            onChange(selected?.id ?? defaultWalletIcon(kind), selected?.name);
          }}
        />
      )}
      {!brand && (
        <fieldset className="grid gap-2" disabled={disabled}>
          <legend className="mb-2 text-sm font-medium">Biểu tượng</legend>
          <div className="flex flex-wrap gap-2">
            {walletIconOptions.map(({ id, label, Icon }) => (
              <Button
                key={id}
                variant="unstyled"
                aria-label={label}
                title={label}
                aria-pressed={value === id}
                disabled={disabled}
                onClick={() => onChange(id)}
                className={`flex size-11 items-center justify-center rounded-xl border ${value === id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:bg-accent'}`}
              >
                <Icon size={20} aria-hidden="true" />
              </Button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
