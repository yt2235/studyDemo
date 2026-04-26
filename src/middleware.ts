import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // 1. Redirect from non-www to www (yichihealth.com -> www.yichihealth.com)
  // Also ensures we use HTTPS if needed (though usually handled by hosting)
  if (host === 'yichihealth.com') {
    url.host = 'www.yichihealth.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // 2. Run next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|_static|_vercel|.*\\..*).*)']
};
