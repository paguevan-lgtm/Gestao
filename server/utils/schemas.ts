import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Cor inválida').optional(),
  icon: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
});

export const transactionSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.string().datetime().or(z.date()), // Accept ISO string or Date object
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category_id: z.string().uuid('Categoria inválida'),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

export const budgetSchema = z.object({
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  category_id: z.string().uuid(),
});
