import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    
  const res = NextResponse.next()
  return res
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if this is an onboarding URL with a userId parameter
  if (req.nextUrl.pathname.startsWith('/onboarding') && req.nextUrl.searchParams.has('userId')) {
    const urlUserId = req.nextUrl.searchParams.get('userId')
    
    // If there's a session and the userId doesn't match the current user
    if (session && session.user.id !== urlUserId) {
      // Redirect them back to their own onboarding
      console.log('Redirecting to own onboarding')
      return res
    //   return NextResponse.redirect(new URL('/onboarding/1', req.url))
    }
  }
  // Redirect unauthenticated users to login
//   if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/auth/login', req.url))
//   }

//   // Redirect authenticated users away from auth pages
//   if (session && req.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/onboarding/1', req.url))
//   }

  return res
}

export const config = {
  matcher: ['/onboarding/:path*', '/auth/:path*'],
} 