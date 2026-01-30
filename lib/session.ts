import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  cookieName: 'delivery-panel-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export interface SessionData {
  userId?: string;
  userName?: string;
  userRole?: string;
  isLoggedIn?: boolean;
}
