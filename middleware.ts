import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/auth', '/landing', '/manifest.webmanifest'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // Note: This is a simplified check. In production, you might want to verify the session server-side
  const authToken = request.cookies.get('sb-auth-token')?.value;
  const session = request.cookies.get('sb-session')?.value;

  if (!authToken && !session) {
    // Redirect to auth page if not authenticated
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
