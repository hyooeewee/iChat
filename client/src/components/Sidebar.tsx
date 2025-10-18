import { useNavigate } from 'react-router-dom';
import assets, { userDummyData } from '../assets';

type User = {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  bio: string;
};

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                className="cursor-pointer text-sm"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] flex items-center gap-2 px-4 py-3 rounded-full mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            placeholder="Search User ..."
            className="bg-transparent outline-none border-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {userDummyData.map((user: User, index: number) => (
          <div
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer 
                hover:bg-[#282142]/20 max-sm:text-sm ${
                  selectedUser?._id === user._id && 'bg-[#282142]/50'
                }`}
            key={index}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              className="w-9 aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="">{user.fullName}</p>
              {/* TODO: Mock online status */}
              {index < 3 ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-neutral-400">Offline</span>
              )}
            </div>
            {/* TODO: Mock notification status */}
            {index > 2 && (
              <p className="absolute top-4 right-4 text-l size-5 flex justify-center items-center rounded-full bg-violet-500/50 ">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
