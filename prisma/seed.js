import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@demo.dev',
      password: 'admin123',
      role: Role.admin,
    },
    {
      email: 'editor@demo.dev',
      password: 'editor123',
      role: Role.editor,
    },
    {
      email: 'viewer@demo.dev',
      password: 'viewer123',
      role: Role.viewer,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: user.email,
          passwordHash: await bcrypt.hash(user.password, 10),
          role: user.role,
        },
      });
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });