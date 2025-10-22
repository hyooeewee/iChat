import { useContext, useState } from 'react';
import assets from '../assets';
import AuthContext from '../context/AuthContext';
import type { AuthContextType } from '../types';

const LoginPage = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [currState, setCurrState] = useState<'register' | 'login'>('login');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [isDataSubmitted, setIsDataSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currState === 'register' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    await auth(
      currState,
      currState === 'register'
        ? {
            email,
            password,
            username: fullName,
            bio,
          }
        : {
            email,
            password,
          }
    );
  };
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ------- Left ------- */}
      <img src={assets.logo_big} className="w-[min(30w,250px)]" />
      {/* ------- Right ------- */}
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              onClick={() => setIsDataSubmitted(false)}
              className=" w-5 cursor-pointer"
            />
          )}
        </h2>
        {currState === 'register' && !isDataSubmitted && (
          <input
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full name"
            onChange={e => setFullName(e.target.value)}
            value={fullName}
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email address"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
            />{' '}
            <input
              type="password"
              placeholder="Password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setPassword(e.target.value)}
              value={password}
              required
            />
          </>
        )}
        {currState === 'register' && isDataSubmitted && (
          <textarea
            rows={5}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            onChange={e => setBio(e.target.value)}
            value={bio}
            required
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === 'register' ? 'Create Account' : 'Login Now'}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex fle-col gap-2">
          {currState === 'register' ? (
            <p className="text-sm text-gray-600">
              Already have an account?
              <span
                className="cursor-pointer font-medium text-violet-500"
                onClick={() => {
                  setCurrState('login');
                  setIsDataSubmitted(false);
                }}
              >
                Login hear
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?
              <span
                className="cursor-pointer font-medium text-violet-500"
                onClick={() => {
                  setCurrState('register');
                  setIsDataSubmitted(false);
                }}
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
