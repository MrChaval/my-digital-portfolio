# Next.js 16 & Arcjet Implementation Guide

## 📚 Documentation References
- [Arcjet Next.js Get Started](https://docs.arcjet.com/get-started?f=next-js)
- [Arcjet Bot Protection](https://docs.arcjet.com/bot-protection/identifying-bots)
- [Arcjet Filters](https://docs.arcjet.com/filters)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js Proxy (Middleware Migration)](https://nextjs.org/docs/messages/middleware-to-proxy)
- [Clerk Next.js Quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)

---

## ✅ Completed Migrations (December 12, 2025)

### 1. **Next.js 16 Upgrade**
- ✅ Updated to Next.js `^16.0.10`
- ✅ React 19 integration
- ✅ Turbopack enabled by default
- ✅ Async Request APIs support

### 2. **Middleware → Proxy Migration**
- ✅ Renamed `middleware.ts` → `proxy.ts`
- ✅ Added named export `export const proxy`
- ✅ Maintained default export for Clerk compatibility
- ✅ Enhanced matcher to exclude `.swa` paths (Azure compatibility)

### 3. **Arcjet Implementation Fixed**
- ✅ Removed invalid `"Googlebot"` string (TypeScript error)
- ✅ Using `CATEGORY:SEARCH_ENGINE` which includes all search bots
- ✅ Proper bot detection with Shield protection
- ✅ Token bucket rate limiting configured

---

## 🔒 Current Security Configuration

### Proxy Configuration (`proxy.ts`)
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/admin','/resources(.*)', '/projects']);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export default proxy;

export const config = {
  matcher: [
    '/((?!_next|.swa|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Protected Routes:**
- `/admin` - Admin dashboard
- `/resources/*` - All resource pages
- `/projects` - Projects page

### Arcjet Configuration (`app/api/arcjet/route.ts`)
```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR",        // Uptime monitoring
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
```

**Security Features:**
- ✅ Shield protection (SQL injection, XSS)
- ✅ Bot detection with allow-list
- ✅ Rate limiting (5 tokens/10sec, capacity: 10)
- ✅ Hosting IP detection
- ✅ Spoofed bot verification

---

## 🎯 Key Changes Made

### TypeScript Error Fixed
**Before:**
```typescript
allow: [
  "CATEGORY:SEARCH_ENGINE",
  "Googlebot", // ❌ Type error
]
```

**After:**
```typescript
allow: [
  "CATEGORY:SEARCH_ENGINE", // ✅ Includes Googlebot
  "CATEGORY:MONITOR",
]
```

### Middleware to Proxy
**Next.js 16 Requirement:**
- File name: `proxy.ts` (was `middleware.ts`)
- Named export: `export const proxy` (recommended)
- Default export: Maintained for Clerk compatibility

**Why?**
> "The term 'middleware' can be confused with Express.js middleware. 'Proxy' clarifies its network boundary purpose."

---

## 🧪 Testing

### Test Arcjet Protection
```bash
# Start dev server
npm run dev

# Visit API endpoint (should work)
curl http://localhost:3000/api/arcjet

# Test rate limiting (refresh multiple times)
# Should return 429 after 10 requests

# Test bot blocking (should return 403)
curl -v http://localhost:3000/api/arcjet
```

### Test Clerk Authentication
```bash
# Visit protected routes (should redirect to sign-in)
http://localhost:3000/admin
http://localhost:3000/projects
http://localhost:3000/resources
```

---

## 📦 Dependencies
- `@arcjet/next`: `^1.0.0-beta.15` (Next.js 15 & 16 compatible)
- `@arcjet/inspect`: `^1.0.0-beta.15`
- `@clerk/nextjs`: `^6.16.0` (Proxy.ts compatible)
- `next`: `^16.0.10`
- `react`: `^19`

---

## 🚀 Next Steps
1. ✅ Test proxy authentication in production
2. ✅ Monitor Arcjet dashboard for bot activity
3. ✅ Configure environment variables for production
4. ⏳ Consider adding email validation rules
5. ⏳ Implement custom error pages for 403/429 responses

---

## 💡 Best Practices Applied
- ✅ All routes public by default (opt-in protection)
- ✅ Separate concerns: Clerk for auth, Arcjet for security
- ✅ Edge Runtime compatibility
- ✅ Azure Static Web Apps ready (`.swa` exclusion)
- ✅ TypeScript strict mode compliant

**Last Updated:** December 12, 2025