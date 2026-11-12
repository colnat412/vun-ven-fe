import type { Session } from './session';

export const avatarKey = (session: Session) => [
  'profile-avatar',
  session.user.id,
  session.accessToken,
];

export const authKeys = {
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
};
