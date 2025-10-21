import { useCallback, useContext, useEffect, useState } from 'react';
import Toast from 'react-hot-toast';
import errorHandler from '../lib/errorHandler';
import type { AuthContextType, ChatContextType, Message, User } from '../types';
import AuthContext from './AuthContext';
import ChatContext from './ChatContext';

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext) as AuthContextType;

  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/messages/users');
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const getMessage = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/messages/${id}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const sendMessage = async (message: Message) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser?._id}`,
        message
      );
      if (data.success) {
        setMessages(messages => [...messages, data.message]);
      } else {
        Toast.error(data.message);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const subscribeMessages = useCallback(async () => {
    if (!socket) return;
    socket.on('newMessage', message => {
      if (selectedUser && selectedUser._id === message.senderId) {
        message.seen = true;
        setMessages(messages => [...messages, message]);
        axios.put(`/api/messages/seen/${message._id}`);
      } else {
        setUnseenMessages((unseenMessages: { [keys: string]: number }) => ({
          ...unseenMessages,
          [message.senderId]: (unseenMessages[message.senderId] || 0) + 1,
        }));
      }
    });
  }, [axios, selectedUser, socket]);

  const unsubscribeMessages = useCallback(async () => {
    if (!socket) return;
    socket.off('newMessage');
  }, [socket]);
  useEffect(() => {
    subscribeMessages();
    return () => {
      unsubscribeMessages();
    };
  }, []);

  const value: ChatContextType = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setMessages,
    setSelectedUser,
    setUnseenMessages,
    getMessage,
    getUsers,
    sendMessage,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
