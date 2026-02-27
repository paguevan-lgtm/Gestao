import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { categorySchema } from '../utils/schemas';

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const categories = await prisma.category.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data = categorySchema.partial().parse(req.body);

    const category = await prisma.category.findFirst({
      where: { id, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, user_id: userId },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Check for transactions
    const transactionCount = await prisma.transaction.count({
      where: { category_id: id },
    });

    if (transactionCount > 0) {
      return res.status(400).json({ error: 'Não é possível excluir categoria com transações vinculadas.' });
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
