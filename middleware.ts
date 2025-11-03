import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  const protectedPaths = ['/inbox', '/analytics'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

      if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      if (pathname.startsWith('/editor') && decoded.role === 'VIEWER') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/inbox/:path*', '/analytics/:path*', '/admin/:path*', '/editor/:path*'],
};
