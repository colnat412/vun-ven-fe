export const MAX_AMOUNT_VND = 1000000000000n;

export function amountError(value: string, minimum = 0n): string {
  if (!/^\d{1,13}$/.test(value)) return 'Nhập số tiền nguyên hợp lệ.';
  const amount = BigInt(value);
  if (amount < minimum) return 'Số tiền phải từ ' + minimum.toLocaleString('vi-VN') + ' đồng.';
  if (amount > MAX_AMOUNT_VND) return 'Số tiền tối đa là 1.000.000.000.000 đồng.';
  return '';
}
