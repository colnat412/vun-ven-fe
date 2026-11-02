import { useState, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
const storageKey = 'hu.theme';
const changeEvent = 'hu:theme-change';
const readSavedTheme = (): Theme => {
  try {
    return localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
  }
  meta.content = getComputedStyle(root).getPropertyValue('--background').trim();
};

export const initializeTheme = () => applyTheme(readSavedTheme());

const subscribe = (listener: () => void) => {
  const syncFromStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    initializeTheme();
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

const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  const [error, setError] = useState('');
  const setTheme = (nextTheme: Theme) => {
    setError('');
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      setError('Đã đổi giao diện nhưng không lưu được lựa chọn trên trình duyệt này.');
    }
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(changeEvent));
  };
  return { theme, setTheme, error };
};
export default useTheme;
