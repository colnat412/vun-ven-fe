import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router';
import AppLayout from './app/layouts/AppLayout';
import PageState from './base/ui/PageState';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home/pages/HomePage';
import SettingsPage from './features/settings/pages/SettingsPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
const CategoryManager = lazy(() => import('./features/categories/components/CategoryManager'));
const CategoryEditPage = lazy(() => import('./features/categories/pages/CategoryEditPage'));
const WalletsPage = lazy(() => import('./features/wallets/pages/WalletsPage'));
const WalletEditPage = lazy(() => import('./features/wallets/pages/WalletEditPage'));
const TransactionEditPage = lazy(() => import('./features/transactions/pages/TransactionEditPage'));

const ReportsPage = lazy(() => import('./features/reports/pages/ReportsPage'));
const ScanPage = lazy(() => import('./features/scan/pages/ScanPage'));
const PhotoCapturePage = lazy(() => import('./features/photo-transactions/pages/PhotoCapturePage'));
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/new" element={<TransactionEditPage />} />
        <Route path="transactions/:transactionId/edit" element={<TransactionEditPage />} />
        <Route path="settings/categories" element={<CategoryManager />} />
        <Route path="settings/categories/new" element={<CategoryEditPage />} />
        <Route path="settings/categories/:categoryId/edit" element={<CategoryEditPage />} />
        <Route path="settings/wallets" element={<WalletsPage />} />
        <Route path="settings/wallets/new" element={<WalletEditPage />} />
        <Route path="settings/wallets/:walletId/edit" element={<WalletEditPage />} />
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
    </>,
  ),
);
const App = () => <RouterProvider router={router} />;
export default App;
