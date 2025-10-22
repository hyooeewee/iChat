import express from 'express';
import {
  getMessagesById,
  getUsers,
  seenMessagesById,
  sendMessageById,
} from '../controllers/messageController';
import { protectRoute } from '../middleware/auth';

const router = express.Router();
router.get('/users', protectRoute, getUsers);
router.get('/:id', protectRoute, getMessagesById);
router.put('/seen/:id', protectRoute, seenMessagesById);
router.post('/send/:id', protectRoute, sendMessageById);

export default router;
