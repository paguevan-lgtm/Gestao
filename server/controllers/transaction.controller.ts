import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { transactionSchema } from '../utils/schemas';

export const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, startDate, endDate, type, categoryId } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = { user_id: userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (type) where.type = type;
    if (categoryId) where.category_id = categoryId;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { category: true },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      data: transactions,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = transactionSchema.parse(req.body);

    // Verify category ownership
    const category = await prisma.category.findFirst({
      where: { id: data.category_id, user_id: userId },
    });

    if (!category) {
      return res.status(400).json({ error: 'Categoria inválida ou não pertence ao usuário.' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        date: data.date,
        description: data.description,
        type: data.type,
        payment_method: data.payment_method,
        notes: data.notes,
        category: { connect: { id: data.category_id } },
        user: { connect: { id: userId } },
      },
      include: { category: true },
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data = transactionSchema.partial().parse(req.body);

    const transaction = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
