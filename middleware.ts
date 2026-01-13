import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Authentication is now optional - all routes are accessible
export async function middleware(request: NextRequest) {
  // Allow all routes since auth is optional
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
