import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(['/admin','/resources(.*)', '/projects']);

// Named export 'proxy' as per Next.js 16 convention
export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

// Also export as default for backward compatibility
export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and .swa paths (for Azure compatibility)
    '/((?!_next|.swa|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};