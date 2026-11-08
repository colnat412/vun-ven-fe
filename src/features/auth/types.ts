export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { displayName: string };
export type AuthMode = 'login' | 'register';
