import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router';
import AppLayout from './app/layouts/AppLayout';
import PageState from './base/ui/PageState';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home/pages/HomePage';
import SettingsPage from './features/settings/pages/SettingsPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';

const ReportsPage = lazy(() => import('./features/reports/pages/ReportsPage'));
const ScanPage = lazy(() => import('./features/scan/pages/ScanPage'));
const PhotoCapturePage = lazy(() => import('./features/photo-transactions/pages/PhotoCapturePage'));
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<Navigate to="/reports" replace />} />
        <Route
          path="capture"
          element={
            <Suspense fallback={<PageState kind="loading" message="Đang mở máy ảnh…" />}>
              <PhotoCapturePage />
            </Suspense>
          }
        />
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
        <Route path="account" element={<Navigate to="/settings" replace />} />
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
