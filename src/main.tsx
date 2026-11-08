import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AppProviders from './app/providers/AppProvider.tsx';
import { initializeTheme } from './features/settings/hooks/useTheme';
import './index.css';

initializeTheme();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
