import { Router } from 'express';
import { register, login, refreshToken, logout, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

console.log('Loading auth routes...');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateToken, getProfile);

export default router;
