import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for static files, auth routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/cron') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next()
  }

  // Add request ID header
  const requestId = crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)

  // Check for auth on dashboard and API routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))

  if (isProtectedRoute) {
    const token =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('x-request-id', requestId)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
}
