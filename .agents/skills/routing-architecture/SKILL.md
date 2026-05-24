---
name: routing-architecture
description: "Trigger: router, new route, lazy load, protected route, page creation. Define the standard for route registration, layouts, protection, and lazy loading in Vue Router."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a new page component in a module (`modules/[module]/pages/`).
- Adding a new route to the Vue Router configuration.
- Protecting routes using RBAC (roles/permissions) or authentication.
- Refactoring imports to optimize the Vite bundle size.

## Hard Rules

- **1. Layout Wrappers**: ALL routes MUST be wrapped inside a Layout component (e.g., `PublicLayout`, `AuthLayout`, `DashboardLayout`) via Vue Router's nested route children. Never register a page route without its Layout wrapper.
- **2. Security First (Navigation Guards)**: Any route that requires state validation (Auth, Guest, Roles, Permissions) MUST set the appropriate `meta` fields (`requiresAuth`, `requiresGuest`, `roles`, `permissions`) on the route definition. A global `beforeEach` guard reads these fields and redirects accordingly (see `auth-flow` skill).
- **3. Lazy Loading for Private Pages**: To prevent Vite from bloating the initial JavaScript bundle, ALL private, authenticated, or heavy pages MUST use dynamic imports in the route `component` field. *Exception: Public/Critical pages (like HomePage or LoginPage) can use static imports to optimize immediate LCP (Largest Contentful Paint).*

## Decision Gates

| Need | Action |
|------|--------|
| Public route (SEO/Landing) | Static import, wrap in a public Layout |
| Guest route (Login/Register) | Set `meta: { requiresGuest: true }` |
| Private dashboard route | Dynamic import, set `meta: { requiresAuth: true }` |
| Feature restricted by role | Set `meta: { roles: ['admin'] }` |
| Feature restricted by perm | Set `meta: { permissions: ['content:write'] }` |

## Execution Steps

1. Create the page component strictly in its respective module: `modules/[module]/pages/` (the root `app/pages/` should only be used for ultra-generic, unassociated pages like 404).
2. In the module's router configuration (`modules/[module]/router/index.ts`), determine if the page is critical for initial load (Static Import) or a private/heavy feature (Dynamic Import):
   ```typescript
   // Static import for critical initial paint
   import LoginPage from '@/modules/auth/pages/LoginPage.vue'

   // Dynamic import for private/heavy features
   const DashboardPage = () => import('@/modules/dashboard/pages/DashboardPage.vue')
   ```
3. Dynamic imports in Vue Router's `component` field already handle code splitting automatically — no `<Suspense>` boundary is needed at the route level. Vue Router loads the chunk on demand.
4. Register the route respecting the strict nested hierarchy:
   ```typescript
   {
     path: '/dashboard',
     component: DashboardLayout,
     meta: { requiresAuth: true },
     children: [
       { path: '', name: 'dashboard', component: DashboardPage }
     ]
   }
   ```

## Output Contract

Return:
- The updated router configuration file (or the newly created page).
- A brief architectural confirmation explaining why the route was lazy-loaded (or statically imported) and verifying the security `meta` fields applied.

## References

- Router configuration: `modules/[module]/router/index.ts`
- Navigation guards: see `auth-flow` skill
- Page organization: see `page-section-architecture` skill
