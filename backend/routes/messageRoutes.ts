import express from 'express';
import { getMessages, createMessage, markAsRead, deleteMessage } from '../controllers/messageController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, adminOnly, getMessages);
router.post('/', createMessage);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
