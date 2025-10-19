import { useEffect, useRef, type FC } from 'react';
import assets, { messagesDummyData } from '../assets';
import formatMsgTime from '../lib/utils';
// type Message = {
//   _id: string;
//   senderId: string;
//   receiverId: string;
//   text: string;
//   seen: boolean;
//   createdAt: string;
// };

type User = {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  bio: string;
};

interface ChatContainerProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const ChatContainer: FC<ChatContainerProps> = ({
  selectedUser,
  setSelectedUser,
}) => {
  const scrollEnd = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return !selectedUser ? (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" />
      <p className="text-white font-medium text-lg">Chat anytime, anywhere.</p>
    </div>
  ) : (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------- Info area ------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johnson
          <span className="size-2 rounded-full bg-green-500"></span>
        </p>
        <img
          src={assets.arrow_icon}
          onClick={() => setSelectedUser(null)}
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} className="max-md:hidden max-w-5" />
      </div>
      {/* ------- Chat area ------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index: number) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg?.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'
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
                  msg?.senderId === '680f50e4f10f3cd28382ecf9'
                } ? 'rounded-br-none':'rounded-bl-none'`}
              >
                {msg?.text}
              </p>
            )}
            <div className="text-xs text-center">
              <img
                src={
                  msg.senderId === '680f50e4f10f3cd28382ecf9'
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formatMsgTime(msg?.createdAt)}</p>
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
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
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
