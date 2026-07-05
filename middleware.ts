import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for static files, auth routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/uploads')
  ) {
    // Basic auth check for API routes if needed, but we do it inside the API
    return NextResponse.next()
  }

  // Check for auth on dashboard
  const isProtectedRoute = pathname.includes('/dashboard')

  if (isProtectedRoute) {
    const token =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect root to dashboard (intl middleware will handle the locale)
  // Wait, intl middleware will just render / with the locale. Let's let it redirect?
  // Actually, we can just let intlMiddleware handle it, and in src/app/[locale]/page.tsx we redirect to /dashboard.
  
  // Call the intl middleware
  const response = intlMiddleware(request);
  
  const requestId = crypto.randomUUID()
  response.headers.set('x-request-id', requestId)

  return response
}

export const config = {
  matcher: ['/', '/(uz|en)/:path*', '/((?!api|_vercel|_next|.*\\..*).*)']
}
