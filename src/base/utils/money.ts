const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export const formatMoney = (amount: string | bigint) => formatter.format(BigInt(amount));
export const sumMoney = (amounts: string[]) =>
  amounts.reduce((total, amount) => total + BigInt(amount), 0n);
export const percentage = (part: bigint, total: bigint) =>
  total > 0n ? Number((part * 10000n) / total) / 100 : 0;
