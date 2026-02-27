import { Router } from 'express';
import { listTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transaction.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', listTransactions);
router.post('/', createTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
