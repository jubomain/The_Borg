import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Check if we're in demo mode (preview environment or missing credentials)
const isDemoMode = () => {
  // Force demo mode in preview environments
  if (typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")) {
    return true
  }

  // Check for missing credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return !supabaseUrl || !supabaseKey
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Handle hash fragments for auth redirects
  const url = req.nextUrl.clone()
  if (url.pathname === "/auth/reset-password" && url.hash && url.hash.includes("access_token")) {
    // Let the client-side handle the hash fragment
    return res
  }

  // Check if we're in demo mode
  if (isDemoMode() || req.nextUrl.hostname.includes("vusercontent.net")) {
    console.log("Middleware: Demo mode detected, allowing access")
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Auth routes that don't require authentication
    const isAuthRoute = req.nextUrl.pathname.startsWith("/auth")

    // Public routes that don't require authentication
    const isPublicRoute =
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname === "/welcome-chat" ||
      req.nextUrl.pathname.startsWith("/docs") ||
      req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/api/init-database") ||
      req.nextUrl.pathname.startsWith("/api/database-status")

    // If user is not signed in and the route is not public or auth, redirect to login
    if (!session && !isPublicRoute && !isAuthRoute) {
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth routes, redirect to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to continue
    // This handles cases where Supabase might not be available
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
