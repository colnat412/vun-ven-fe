import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import queryClient from '../queryClient';

type AppProvidersProps = {
  children: ReactNode;
};
const AppProviders = (props: AppProvidersProps) => {
  const { children } = props;
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
export default AppProviders;
