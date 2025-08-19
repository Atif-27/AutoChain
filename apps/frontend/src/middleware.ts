import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/zap')
  
  // Get the token from cookies
  const userData = request.cookies.get('userData')?.value
  let isAuthenticated = false

  try {
    if (userData) {
      const parsedUserData = JSON.parse(userData)
      // The cookie stores data directly without the state wrapper
      isAuthenticated = !!(parsedUserData.userId && parsedUserData.accessToken)
    }
  } catch (error) {
    console.error('Error parsing userData cookie:', error)
  }

  // If it's a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page with the original URL as redirect parameter
    const from = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?redirect=${from}`, request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/zap/:path*', '/ai/:path*']
} 