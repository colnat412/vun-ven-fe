import { useState, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export const colorThemes = [
  { value: 'teal', label: 'Xanh ngọc', swatch: '#2d8179' },
  { value: 'amber', label: 'Vàng cam', swatch: '#ffb547' },
  { value: 'purple', label: 'Tím', swatch: '#8250c4' },
  { value: 'red', label: 'Đỏ', swatch: '#c13d46' },
  { value: 'pink', label: 'Hồng', swatch: '#c03b79' },
] as const;
export type ColorTheme = (typeof colorThemes)[number]['value'];
const storageKey = 'hu.theme';
const colorStorageKey = 'vunven.color-theme';
const changeEvent = 'hu:theme-change';
const isColorTheme = (value: unknown): value is ColorTheme =>
  colorThemes.some((color) => color.value === value);
const readSavedColor = (): ColorTheme => {
  try {
    const value = localStorage.getItem(colorStorageKey);
    return isColorTheme(value) ? value : 'amber';
  } catch {
    return 'amber';
  }
};
const readSavedTheme = (): Theme => {
  try {
    return localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};
const applyTheme = (theme: Theme, color: ColorTheme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.dataset.colorTheme = color;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
  }
  meta.content = getComputedStyle(root).getPropertyValue('--background').trim();
};

export const initializeTheme = () => applyTheme(readSavedTheme(), readSavedColor());

const subscribe = (listener: () => void) => {
  const syncFromStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== colorStorageKey && event.key !== null) return;
    applyTheme(
      event.key === storageKey || event.key === null ? readSavedTheme() : getSnapshot(),
      event.key === colorStorageKey || event.key === null ? readSavedColor() : getColorSnapshot(),
    );
    listener();
  };
  window.addEventListener(changeEvent, listener);
  window.addEventListener('storage', syncFromStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener('storage', syncFromStorage);
  };
};
const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const getColorSnapshot = (): ColorTheme => {
  const value = document.documentElement.dataset.colorTheme;
  return isColorTheme(value) ? value : 'amber';
};

const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  const colorTheme = useSyncExternalStore(subscribe, getColorSnapshot);
  const [error, setError] = useState('');
  const setTheme = (nextTheme: Theme) => {
    setError('');
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      setError('Đã đổi giao diện nhưng không lưu được lựa chọn trên trình duyệt này.');
    }
    applyTheme(nextTheme, getColorSnapshot());
    window.dispatchEvent(new Event(changeEvent));
  };
  const setColorTheme = (nextColor: ColorTheme) => {
    setError('');
    try {
      localStorage.setItem(colorStorageKey, nextColor);
    } catch {
      setError('Đã đổi màu nhưng không lưu được lựa chọn trên trình duyệt này.');
    }
    applyTheme(getSnapshot(), nextColor);
    window.dispatchEvent(new Event(changeEvent));
  };
  return { theme, setTheme, colorTheme, setColorTheme, error };
};
export default useTheme;
