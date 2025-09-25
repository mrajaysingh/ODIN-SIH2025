import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard routes are now open for demo purposes
  // Uncomment below to re-enable authentication protection
  /*
  if (pathname.startsWith('/dashboard')) {
    const hasToken = request.cookies.get('token')?.value || request.headers.get('authorization');
    if (!hasToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


