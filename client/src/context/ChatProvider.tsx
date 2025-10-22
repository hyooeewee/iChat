import { useContext, useEffect, useState } from 'react';
import Toast from 'react-hot-toast';
import errorHandler from '../lib/errorHandler';
import type {
  AuthContextType,
  ChatContextType,
  Message,
  SendMessageType,
  User,
} from '../types';
import AuthContext from './AuthContext';
import ChatContext from './ChatContext';

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<{
    [keys: string]: number;
  }>({});
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
  const getMessages = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/messages/${id}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const sendMessage = async (message: SendMessageType) => {
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
  const subscribeMessages = async () => {
    console.log('socket:', socket);
    console.log('subscribing');
    socket?.on('test', (msg: string) => {
      console.log('msg:', msg);
    });
    if (!socket) return;
    socket.on('newMessage', (message: Message) => {
      console.log('new Msg:', message);
      if (selectedUser && selectedUser._id === message.senderId) {
        message.seen = true;
        setMessages(messages => [...messages, message]);
        axios.put(`/api/messages/seen/${message._id}`);
      } else {
        setUnseenMessages(prev => ({
          ...prev,
          [message.senderId]: (unseenMessages[message.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeMessages = async () => {
    console.log('unsubscribing');
    if (!socket) return;
    socket.off('newMessage');
  };
  useEffect(() => {
    subscribeMessages();
    return () => {
      unsubscribeMessages();
    };
  }, [selectedUser, socket]);

  const value: ChatContextType = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setMessages,
    setSelectedUser,
    setUnseenMessages,
    getMessages,
    getUsers,
    sendMessage,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
