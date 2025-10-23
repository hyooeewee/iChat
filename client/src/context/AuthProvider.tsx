/// <reference types="vite/client" />
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { io, type Socket } from 'socket.io-client';
import errorHandler from '../lib/errorHandler';
import type { AuthContextType, UpdateProfile, User } from '../types';
import AuthContext from './AuthContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  // Socket create
  const createSocket = async (user: User) => {
    if (!user || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: user?._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on('onlineUsers', (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  };
  // Authorization validation
  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check-auth');
      if (data.success) {
        setAuthUser(data.user);
        createSocket(data.user);
      }
    } catch (error) {
      // errorHandler(error);
      console.error('Authorization Error', error);
    }
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
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setAuthUser(data.user);
        createSocket(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setAuthUser(null);
      setOnlineUsers([]);
      setToken(null);
      socket?.disconnect();
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully!');
    } catch (error) {
      errorHandler(error);
    }
  };
  const updateProfile = async (user: UpdateProfile) => {
    try {
      const { data } = await axios.put('/api/auth/update-profile', user);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const value: AuthContextType = {
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
export default AuthProvider;
