import express from 'express';
import { login, logout, refreshToken } from '../controllers/authController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;
