import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Alimentação', type: 'EXPENSE', color: '#EF4444', icon: 'utensils' },
    { name: 'Transporte', type: 'EXPENSE', color: '#3B82F6', icon: 'car' },
    { name: 'Moradia', type: 'EXPENSE', color: '#10B981', icon: 'home' },
    { name: 'Lazer', type: 'EXPENSE', color: '#F59E0B', icon: 'gamepad' },
    { name: 'Saúde', type: 'EXPENSE', color: '#EC4899', icon: 'heart' },
    { name: 'Educação', type: 'EXPENSE', color: '#8B5CF6', icon: 'book' },
    { name: 'Salário', type: 'INCOME', color: '#10B981', icon: 'dollar-sign' },
    { name: 'Freelance', type: 'INCOME', color: '#6366F1', icon: 'laptop' },
    { name: 'Investimentos', type: 'INCOME', color: '#8B5CF6', icon: 'trending-up' },
  ];

  // We need a user to attach these to. 
  // In a real app, we might create default categories on user registration.
  // For seeding, we'll just create a demo user.
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@findash.com' },
    update: {},
    create: {
      email: 'demo@findash.com',
      name: 'Usuário Demo',
      password_hash: '$2a$10$X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7', // Invalid hash, just for placeholder
    },
  });

  for (const cat of categories) {
    await prisma.category.create({
      data: {
        ...cat,
        user_id: user.id,
      },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
