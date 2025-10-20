import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Toast from 'react-hot-toast';
import { io, type Socket } from 'socket.io-client';
import errorHandler from '../lib/errorHandler';
import type { User } from '../types';
import { AuthContext } from './authContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  // Authorization validation
  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check-auth');
      if (data.success) {
        setAuthUser(data.user);
        createSocket(data.user);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  // Socket create
  const createSocket = async (user: User) => {
    if (!user || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: user?._id,
      },
    });
    newSocket.connect();
    newSocket.on('connect', () => {
      setSocket(socket);
    });
    newSocket.on('onlineUsers', (userIds: User[]) => {
      setOnlineUsers(userIds);
    });
  };
  useEffect(() => {
    if (token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    checkAuth();
  }, []);
  // Auth handler
  const auth = async (
    state: 'login' | 'register',
    credentials: { [key: string]: string }
  ) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        createSocket(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(data.token);
        localStorage.setItem('token', data.token);
        Toast.success(data.message);
      } else {
        Toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      const { data } = await axios.post('/api/auth/logout');
      if (data.success) {
        setAuthUser(null);
        setOnlineUsers([]);
        setSocket(null);
        socket?.disconnect();
        delete axios.defaults.headers.common['Authorization'];
        Toast.success(data.message);
      } else {
        Toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const updateProfile = async (user: Omit<User, '_id'>) => {
    try {
      const { data } = await axios.put('/api/auth/update-profile', user);
      if (data.success) {
        setAuthUser(data.user);
        Toast.success(data.message);
      } else {
        Toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    auth,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
