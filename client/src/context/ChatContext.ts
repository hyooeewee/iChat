import { createContext } from 'react';
import type { ChatContextType } from '../types/context';

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
