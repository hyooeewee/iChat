import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinary';
import Message, { type IMessage } from '../models/Message';
import User from '../models/User';
import { clientsMap, io } from '../server';
import { type AuthRequest } from '../types';

export const getUserForSidebar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      '-password'
    );
    const unseenMessages: Record<string, IMessage[]> = {};
    const promises = filteredUsers.map(async user => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id.toString()] = messages;
      }
    });
    await Promise.all(promises);
    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getMessagesByContactId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: contactId } = req.params;
    const userId = req.user._id;
    const messages = await Message.find<IMessage>({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: contactId,
      },
      { seen: true }
    );
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const seenMessagesByMessageId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { seen: true });
    res
      .status(200)
      .json({ success: true, message: 'Message seen successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendMessageByContactId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const imageUrl = image
      ? (await cloudinary.uploader.upload(image)).secure_url
      : null;
    const message = await Message.create({
      content,
      image: imageUrl,
      senderId,
      receiverId,
    });
    if (
      receiverId &&
      typeof receiverId === 'string' &&
      Types.ObjectId.isValid(receiverId)
    ) {
      const receiverObjectId = new Types.ObjectId(receiverId);
      const receiverSocketId = clientsMap.get(receiverObjectId);
      if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', message);
    }
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
