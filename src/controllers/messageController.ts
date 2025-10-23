import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from '../@types';
import cloudinary from '../config/cloudinary';
import Message, { type IMessage } from '../models/Message';
import User from '../models/User';
import { clientsMap, io } from '../server';

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      '-password'
    );
    const unseenMessagesResult = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: '$senderId',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          keyValueArray: {
            $push: {
              k: { $toString: '$_id' },
              v: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          unseenMessages: { $arrayToObject: '$keyValueArray' },
        },
      },
    ]);

    const unseenMessages =
      unseenMessagesResult.length > 0
        ? unseenMessagesResult[0].unseenMessages
        : {};

    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getMessagesById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: contactId } = req.params;
    const userId = req.user?._id;
    const messages = await Message.find<IMessage>({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    });
    await Message.updateMany(
      {
        senderId: contactId,
        receiverId: userId,
      },
      { seen: true }
    );
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const seenMessagesById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { returnDocument: 'after' }
    );
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendMessageById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;
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
      const receiverSocketId = clientsMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', message);
        console.log(
          `${senderId} send ${message} to ${receiverId}: ${receiverSocketId}`
        );
        clientsMap.forEach((socketId, userId) => {
          console.log(`${userId} is online: ${socketId}`);
          io.to(socketId).emit('test', 'info');
        });
      }
    }
    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};
