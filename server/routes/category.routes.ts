import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', listCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
