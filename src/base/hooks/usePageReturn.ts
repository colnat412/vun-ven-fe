import { useLocation, useNavigate } from 'react-router';

export default function usePageReturn(fallback: string) {
  const location = useLocation();
  const navigate = useNavigate();
  return () => {
    const from: unknown = location.state?.returnTo;
    if (
      typeof from === 'string' &&
      from.startsWith('/') &&
      !from.startsWith('//') &&
      window.history.state?.idx > 0
    )
      navigate(-1);
    else navigate(fallback, { replace: true });
  };
}
