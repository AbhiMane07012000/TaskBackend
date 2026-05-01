import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/projects', '/tasks', '/users', '/notifications', '/plans'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
