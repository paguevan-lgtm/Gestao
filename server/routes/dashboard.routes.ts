import { Router } from 'express';
import { getDashboardSummary, getChartData } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/summary', getDashboardSummary);
router.get('/charts', getChartData);

export default router;
