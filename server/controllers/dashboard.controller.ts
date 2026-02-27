import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // Current Month Totals
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: { gte: start, lte: end },
      },
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = currentMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    // Total Balance (All time)
    const allTransactions = await prisma.transaction.findMany({
      where: { user_id: userId },
    });
    const totalBalance = allTransactions.reduce((acc, t) => {
      return t.type === 'INCOME' ? acc + Number(t.amount) : acc - Number(t.amount);
    }, 0);

    // Last Month Comparison
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });
    
    const lastMonthIncome = lastMonthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((acc, t) => acc + Number(t.amount), 0);
    
    const lastMonthExpense = lastMonthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    res.json({
      totalBalance,
      currentMonth: {
        income,
        expense,
        balance,
        savingsRate,
      },
      lastMonth: {
        income: lastMonthIncome,
        expense: lastMonthExpense,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChartData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5); // Include current month

    // 1. Balance Evolution (Last 6 months)
    // This is complex to calculate accurately for "balance at end of month" without running balance.
    // Simplified: Net income per month.
    
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: { gte: startOfMonth(sixMonthsAgo) },
      },
      orderBy: { date: 'asc' },
    });

    // Group by month
    const monthlyData = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(t => {
      const monthKey = t.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expense: 0 });
      }
      const data = monthlyData.get(monthKey)!;
      if (t.type === 'INCOME') data.income += Number(t.amount);
      else data.expense += Number(t.amount);
    });

    const evolution = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }));

    // 2. Expense by Category (Current Month)
    const currentMonthExpenses = transactions.filter(t => 
      t.type === 'EXPENSE' && 
      t.date >= startOfMonth(now) && 
      t.date <= endOfMonth(now)
    );

    // We need category names, so we might need to fetch them or include them in query
    // The previous query didn't include category. Let's fetch categories for these IDs.
    const categoryIds = [...new Set(currentMonthExpenses.map(t => t.category_id))];
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const expensesByCategory = new Map<string, number>();
    currentMonthExpenses.forEach(t => {
      const catName = categoryMap.get(t.category_id)?.name || 'Unknown';
      expensesByCategory.set(catName, (expensesByCategory.get(catName) || 0) + Number(t.amount));
    });

    const categoryDistribution = Array.from(expensesByCategory.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      evolution,
      categoryDistribution,
    });
  } catch (error) {
    next(error);
  }
};
