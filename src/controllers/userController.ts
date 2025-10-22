import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { comparePassword, generateToken, hashPassword } from '../lib/secret';
import User from '../models/User';
import type { AuthRequest } from '../types';

export const register = async (req: Request, res: Response) => {
  /**
   * Register a new user
   * @route POST /api/register
   * @param {string} username - The username of the user
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @param {string} bio - The bio of the user
   * @throws {Error} If the user already exists
   */
  const { username, email, password, bio } = req.body;
  try {
    if (!username || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken({ id: newUser._id });
    res.status(200).json({
      success: true,
      token,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'User could not be created',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
      });
    }
    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    const token = generateToken({ id: user._id });
    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'User could not be logged in',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePic, bio, username } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          username,
          profilePic: upload.secure_url,
        },
        { returnDocument: 'after' }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          username,
        },
        { returnDocument: 'after' }
      );
    }
    res.status(201).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Profile could not be updated',
    });
  }
};
