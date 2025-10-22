import React, { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import assets from '../assets';
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';
import formatMsgTime from '../lib/utils';
import type { AuthContextType, ChatContextType, Message } from '../types';
const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, sendMessage, getMessages } =
    useContext(ChatContext) as ChatContextType;
  const { authUser, onlineUsers } = useContext(AuthContext) as AuthContextType;
  const scrollEnd = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>('');
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({
      content: input.trim(),
    });
    setInput('');
  };
  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type.startsWith('images/')) {
      toast.error('Please select an image');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      await sendMessage({
        image: base64Image,
      });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);
  return !selectedUser ? (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" />
      <p className="text-white font-medium text-lg">Chat anytime, anywhere.</p>
    </div>
  ) : (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------- Info area ------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
        />
        <div className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.username || 'Martin Johnson'}
          {onlineUsers?.includes(selectedUser?._id) && (
            <span className="size-2 bg-green-500 rounded-full"></span>
          )}
        </div>
        <img
          src={assets.arrow_icon}
          onClick={() => setSelectedUser(null)}
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} className="max-md:hidden max-w-5" />
      </div>
      {/* ------- Chat area ------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg: Message, index: number) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg?.senderId !== authUser?._id && 'flex-row-reverse'
            }`}
          >
            {msg?.image ? (
              <img
                src={msg?.image}
                className="max-w-2xs border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-2xs md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg?.senderId === authUser?._id
                } ? 'rounded-br-none':'rounded-bl-none'`}
              >
                {msg?.content}
              </p>
            )}
            <div className="text-xs text-center">
              <img
                src={
                  msg.senderId === authUser?._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser.profilePic || assets.avatar_icon
                }
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMsgTime(msg.createdAt as string)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* ------- Send area ------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 ">
        <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message ..."
            className="flex-1 text-sm p-3 border-none rounded-lg text-white outline-none placeholder-gray-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && input) handleSendMessage(e);
            }}
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSendImage(e);
            }}
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img src={assets.send_button} className="w-7 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatContainer;
