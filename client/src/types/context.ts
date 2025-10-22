import { Axios } from 'axios';
import { type Socket } from 'socket.io-client';
import type { Message, User } from './common';

type UpdateProfile = Pick<User, 'username' | 'bio'> &
  Partial<Pick<User, 'profilePic'>>;

type SendMessageType = Pick<Message, 'content' | 'image'>;

interface AuthContextType {
  axios: Axios;
  authUser: User | null;
  onlineUsers: string[] | null;
  socket: Socket | null;
  auth: (
    state: 'login' | 'register',
    credentials: { [keys: string]: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: UpdateProfile) => Promise<void>;
}

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  unseenMessages: { [keys: string]: number };
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUnseenMessages: React.Dispatch<
    React.SetStateAction<{ [keys: string]: number }>
  >;
  getUsers: () => Promise<void>;
  sendMessage: (message: SendMessageType) => Promise<void>;
  getMessages: (id: string) => Promise<void>;
}

export type {
  AuthContextType,
  ChatContextType,
  SendMessageType,
  UpdateProfile,
};
