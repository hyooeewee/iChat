import { Axios } from 'axios';
import { type Socket } from 'socket.io-client';
import type { User } from './common';

interface AuthContextType {
  axios: Axios;
  authUser: User | null;
  onlineUsers: User[] | null;
  socket: Socket | null;
  auth: (
    state: 'login' | 'register',
    credentials: { [keys: string]: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Omit<User, '_id'>) => Promise<void>;
}

export type { AuthContextType };
