import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import AppLayout from './app/layouts/AppLayout';
import HomePage from './features/home/pages/HomePage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import PageState from './shared/ui/PageState';

const ReportsPage = lazy(() => import('./features/reports/pages/ReportsPage'));
const ScanPage = lazy(() => import('./features/scan/pages/ScanPage'));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<Navigate to="/reports" replace />} />
        <Route
          path="reports"
          element={
            <Suspense fallback={<PageState kind="loading" message="Đang mở thống kê…" />}>
              <ReportsPage />
            </Suspense>
          }
        />
        <Route
          path="scan"
          element={
            <Suspense fallback={<PageState kind="loading" message="Đang mở màn hình quét…" />}>
              <ScanPage />
            </Suspense>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={
            <div className="page-state">
              <h1>Không tìm thấy trang</h1>
              <Link className="text-link" to="/">
                Về Trang chủ
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
