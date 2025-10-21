import { NextFunction, Response } from 'express';
import { verifyToken } from '../lib/secret';
import User from '../models/User';
import { AuthRequest, tokenPayloadType } from '../types';

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const decoded = verifyToken(token) as tokenPayloadType;
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
