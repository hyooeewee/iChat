import express from 'express';
import {
  getMessagesByContactId,
  getUserForSidebar,
  seenMessagesByMessageId,
  sendMessageByContactId,
} from '../controllers/messageController';
import { protectRoute } from '../middleware/auth';

const router = express.Router();
router.get('/users', protectRoute, getUserForSidebar);
router.get('/:id', getMessagesByContactId);
router.put('/seen/:id', protectRoute, seenMessagesByMessageId);
router.put('/send/:id', protectRoute, sendMessageByContactId);

export default router;
