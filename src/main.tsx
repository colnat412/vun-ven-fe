import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AppProviders from './app/providers/AppProvider.tsx';
import { initializeTheme } from './features/settings/hooks/useTheme';

// Restore the saved theme before React renders the application.
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
