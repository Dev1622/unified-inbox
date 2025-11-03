import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { prisma } from '@/lib/prisma'; 
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}


  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Set-Cookie': serialize('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 3600,
      }),
    },
  });
}
