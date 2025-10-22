import { useContext, useEffect, useState } from 'react';
import assets from '../assets';
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';
import type { AuthContextType, ChatContextType, Message } from '../types';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext) as ChatContextType;
  const { logout, onlineUsers } = useContext(AuthContext) as AuthContextType;
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    setImages(
      messages.map((message: Message) => {
        return message.image as string;
      })
    );
  }, [messages]);
  return (
    selectedUser && (
      <div
        className={`bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? 'max-md:hidden' : ''
        }`}
      >
        {/* ------- Profile ------- */}
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-20 aspect-square rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {selectedUser?.username}
            {onlineUsers?.includes(selectedUser?._id) && (
              <p className="size-2 bg-green-500 rounded-full"></p>
            )}
          </h1>
          <p className="px-10 mx-auto">{selectedUser?.bio}</p>
        </div>
        {/* -------- Media -------- */}
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {images.map((url: string, index: number) => (
              <div
                key={index}
                className="cursor-pointer rounded"
                onClick={() => window.open(url)}
              >
                <img src={url} className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        {/* ------- Action ------- */}
        <button
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-xs font-light py-2 px-20 rounded-full cursor-pointer"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
