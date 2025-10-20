import express from 'express';
import { login, register, updateProfile } from '../controllers/userController';
import { checkAuth, protectRoute } from '../middleware/auth';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check-auth', protectRoute, checkAuth);

export default router;
