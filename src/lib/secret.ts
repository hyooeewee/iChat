import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { tokenPayloadType } from '../@types';

export const generateToken = (payload: tokenPayloadType) => {
  /**
   * Generate a token
   * @param {Object} payload - The payload to be signed
   * @returns {string} The generated token
   */
  const token = jwt.sign(payload, process.env['JWT_SECRET'] as string, {
    expiresIn: '1d',
  });
  return token;
};
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env['JWT_SECRET'] as string
    ) as tokenPayloadType;
    return decoded;
  } catch (error) {
    return console.error(error);
  }
};

export const hashPassword = async (password: string) => {
  /**
   * Hash a password
   * @param {string} password - The password to be hashed
   * @returns {string} The hashed password
   */
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  /**
   * Compare a password with a hashed password
   * @param {string} password - The password to be compared
   * @param {string} hashedPassword - The hashed password to be compared with
   * @returns {boolean} True if the passwords match, false otherwise
   */
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
