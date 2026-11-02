export const APP_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const APP_UTC_OFFSET = '+07:00';
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const pad = (value: number) => String(value).padStart(2, '0');

export const isValidDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};
export const isValidTime = (value: unknown): value is string =>
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export const hasTime = (value: string) => !datePattern.test(value);
export const isValidDateTime = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  if (isValidDate(value)) return true; // Existing date-only records keep unknown time.
  const parts =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):([0-5]\d)(?:\.\d{1,3})?(Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.exec(
      value,
    );
  return (
    !!parts && isValidDate(parts[1]) && isValidTime(parts[2]) && Number.isFinite(Date.parse(value))
  );
};

const zonedParts = (value: Date | string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { ...options, timeZone: APP_TIME_ZONE }).formatToParts(
    typeof value === 'string' ? new Date(value) : value,
  );

export const dateKey = (value: Date | string): string => {
  if (typeof value === 'string') {
    if (isValidDate(value)) return value;
    if (!isValidDateTime(value)) throw new Error('Ngày giờ không hợp lệ hoặc thiếu múi giờ.');
  }
  const parts = zonedParts(value, { year: 'numeric', month: '2-digit', day: '2-digit' });
  const part = (name: Intl.DateTimeFormatPartTypes) =>
    parts.find((row) => row.type === name)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};
export const monthKey = (value: Date | string) => dateKey(value).slice(0, 7);
export const dayOfMonth = (value: Date | string) => Number(dateKey(value).slice(8));
export const today = (reference = new Date()) => dateKey(reference);
export const currentMonth = (reference = new Date()) => monthKey(reference);
export const currentTime = (reference = new Date()) => {
  const parts = zonedParts(reference, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return `${parts.find((part) => part.type === 'hour')!.value}:${parts.find((part) => part.type === 'minute')!.value}`;
};
export const toDateTime = (date: string, time: string) => {
  if (!isValidDate(date) || !isValidTime(time))
    throw new Error('Ngày hoặc giờ giao dịch không hợp lệ.');
  return `${date}T${time}:00${APP_UTC_OFFSET}`;
};
export const formatDate = (value: Date | string) => {
  const [year, month, day] = dateKey(value).split('-');
  return `${day}/${month}/${year}`;
};
export const formatTime = (value: string) =>
  hasTime(value) ? currentTime(new Date(value)) : 'Chưa có giờ';
export const formatDateTime = (value: string) => `${formatDate(value)} · ${formatTime(value)}`;
export const formatLongDate = (value: Date | string = new Date()) =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: APP_TIME_ZONE,
  }).format(new Date(`${dateKey(value)}T12:00:00${APP_UTC_OFFSET}`));
export const monthLabel = (month: string) =>
  `Tháng ${Number(month.slice(5))}, ${month.slice(0, 4)}`;
export const daysInMonth = (month: string) => {
  if (!monthPattern.test(month)) throw new Error('Tháng không hợp lệ.');
  return new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0)).getUTCDate();
};
export const remainingDaysInMonth = (month: string, reference = new Date()) =>
  month < currentMonth(reference)
    ? 0
    : month === currentMonth(reference)
      ? daysInMonth(month) - dayOfMonth(reference) + 1
      : daysInMonth(month);

export const compareDateTimeDescending = (a: string, b: string) => {
  const dayOrder = dateKey(b).localeCompare(dateKey(a));
  if (dayOrder) return dayOrder;
  if (!hasTime(a) || !hasTime(b)) return Number(hasTime(b)) - Number(hasTime(a));
  return Date.parse(b) - Date.parse(a);
};
// DayPicker uses local Date objects as calendar cells, not as UTC instants.
export const toCalendarDate = (value: string) => {
  const [year, month, day] = dateKey(value).split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};
export const calendarDateKey = (value: Date) =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
