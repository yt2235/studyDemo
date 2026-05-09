import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { slugify } from './lib/slug';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // 1. Redirect from non-www to www (yichihealth.com -> www.yichihealth.com)
  // Also ensures we use HTTPS if needed (though usually handled by hosting)
  if (host === 'yichihealth.com') {
    url.host = 'www.yichihealth.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // 2. Redirect legacy product ID URLs to the canonical product slug.
  const legacyProductMatch = url.pathname.match(/^\/(en|zh)\/products\/(\d+)\/?$/);
  if (legacyProductMatch) {
    const [, locale, productId] = legacyProductMatch;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/products?select=id,name&id=eq.${productId}&limit=1`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const products = (await response.json()) as Array<{ id: number; name: string | null }>;
          const product = products[0];

          if (product?.name) {
            url.pathname = `/${locale}/products/${product.id}-${slugify(product.name)}`;
            return NextResponse.redirect(url, 301);
          }
        }
      } catch (error) {
        console.warn('Failed to resolve legacy product URL:', error);
      }
    }
  }

  // 3. Run next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|_static|_vercel|.*\\..*).*)']
};
