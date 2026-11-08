import { createHttpClient } from '@/base/api/httpClient';
import { getSession } from '@/features/auth/session';

// Application configuration stays outside base; base does not depend on auth.
export const apiClient = createHttpClient({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  getAccessToken: () => getSession()?.accessToken,
});
