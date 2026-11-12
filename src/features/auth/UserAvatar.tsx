import { useState } from 'react';
import { useBaseQuery } from '@/base/hooks/useBaseQuery';
import { getAvatar } from './api/authApi';
import type { Session } from './session';
import { avatarKey } from './key';

const UserAvatar = ({ session, className = '' }: { session: Session; className?: string }) => {
  const [failedUrl, setFailedUrl] = useState('');
  const avatar = useBaseQuery({
    queryKey: avatarKey(session),
    queryFn: ({ signal }) => getAvatar(session.accessToken, signal),
    enabled: !!session.user.hasAvatar,
    staleTime: 180_000,
    refetchInterval: 240_000,
  });
  const url = session.user.hasAvatar ? avatar.data?.url : undefined;
  const initials = Array.from(session.user.displayName.trim())
    .slice(0, 1)
    .join('')
    .toLocaleUpperCase('vi');
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary ${className}`}
      aria-hidden="true"
    >
      {url && url !== failedUrl ? (
        <img
          src={url}
          alt=""
          className="size-full object-cover"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        initials || '?'
      )}
    </span>
  );
};

export default UserAvatar;
