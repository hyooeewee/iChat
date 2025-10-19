import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets';

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState<Blob>();
  const [name, setName] = useState<string>('Martin Johnson');
  const [bio, setBio] = useState<string>(
    'Hi everyone, I am using ChatApp to chat with my friends.'
  );
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-center max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-3xl font-bold">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={e => setSelectedImg(e.target.files?.[0])}
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              className={`size-12 ${selectedImg && 'rounded-full'}`}
            />
            Upload profile image
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={e => setName(e.target.value)}
            value={name}
            required
          />
          <textarea
            placeholder="Write profile bio..."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={e => setBio(e.target.value)}
            value={bio}
            required
          />
          <button
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
