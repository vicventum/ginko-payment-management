---
name: auth-flow
description: "Trigger: authentication, login, register, protected route, session state, auth roles. Implement the Auth Flow architecture for Vue."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Bootstrapping a new Vue project that requires user authentication.
- Implementing protected routes via Vue Router navigation guards.
- Creating or refactoring Login, Register, or Logout API composables.
- Setting up Role-Based Access Control (RBAC).

## Rendering Mode — Read First

The auth architecture adapts based on your rendering mode. Identify yours before proceeding:

| Mode | Characteristics |
|------|-----------------|
| **SSR** (default) | Server renders first page, hydrates on client. Most complex auth setup. |
| **SPA** | Client-only rendering. No server render, simpler auth. |
| **SSG** | Static pages at build time, hydrates on client. Auth behaves like SPA at runtime. |

Rules marked with 🌐 apply to **ALL modes**. Rules marked with 🖥️ apply to **SSR only**.

## Hard Rules

### 1. 🌐 Global State — Pinia Store (`store-session.ts`)

Use Pinia (or equivalent) with a cookie-backed token to hold `user` metadata and the access token. Keep it pure: only state and raw setters (`setSession`, `cleanSession`, `updateUser`).

- Located in `modules/auth/stores/store-session.ts`.
- State: `user` object (reactive), token read from cookies.
- Setters: `setSession(user, token)`, `cleanSession()`, `updateUser(data)`.
- Getters: `isAuthenticated`, `getAccessToken`, `userRoles`, `userPermissions`.
- MUST NOT contain business logic, redirect logic, or API calls.

### 2. 🌐 Session Composable (`use-session.ts`)

Wrap the Pinia store in a composable. This is the consumer layer that components and navigation guards use.

- Located in `modules/auth/composables/use-session.ts`.
- For **Advanced** apps: MUST expose role/permission checks (`hasRole`, `hasPermission`).
- For **Simple** apps: omit role/permission logic.

### 3. 🌐 Navigation Guards (`auth.ts`, `guest.ts`)

Navigation guard files that consume `use-session` to guard route access.

- **`auth.ts`**: Redirects unauthenticated users to `/login`. Applied via `route.meta.requiresAuth`.
- **`guest.ts`**: Redirects authenticated users away from login/register. Applied via `route.meta.requiresGuest`.
- **`roles.ts`** (Advanced): Validates `route.meta.roles` against `useSession().hasRole()`. Redirects to `/unauthorized` on mismatch.
- **`permissions.ts`** (Advanced): Validates `route.meta.permissions` against `useSession().hasPermission()`. Redirects to `/unauthorized` on mismatch.

> **Important**: Navigation guards protect the UI experience (redirects), but are NOT a security boundary by themselves. A malicious user can call API routes directly. See Rule 6.

### 4. 🌐 API Client with Auth Interceptors (`client-[name]-auth.ts`)

The API client (`$fetch` / `ofetch` configuration) MUST consume the token directly from the Pinia store (e.g., `useSessionStore().getAccessToken`), rather than reading cookies or localStorage directly. This keeps the store as the single source of truth.

- Located in `modules/_core/api/clients/client-[name]-auth.ts`.
- MUST handle 401 responses with automatic token refresh or session cleanup.

### 5. 🌐 Auth API Composables

Auth endpoints MUST strictly follow the `api-architecture` skill (Client → Provider → Service → Composable):

- **`use-login.ts`**: Mutation. On success, MUST call `setSession(user, token)`.
- **`use-register.ts`**: Mutation. On success, calls `setSession` or redirects.
- **`use-logout.ts`**: Mutation. MUST call `cleanSession()`, clear the auth cookie, and redirect to `/login`.
- **`use-verify-session.ts`** (Advanced): Query. Hits `/auth/me` on app load to sync local state with the backend. Skip if building a simple flow.

### 6. 🌐 Server API Guards (Security Boundary)

If the app has server API routes, they MUST independently validate the session token from the request. This applies regardless of rendering mode — even SPAs can have server API routes.

Client-side navigation guards alone are NOT enough for security.

### 7. 🖥️ SSR Cookie Forwarding (SSR ONLY)

When the app makes API calls during server-side rendering, the browser's cookies are NOT automatically forwarded to the external API. You MUST pass the request cookies manually.

**SPA/SSG**: Skip this rule. All API calls originate from the browser, which sends cookies automatically.

## Decision Gates

| Need | Action |
|------|--------|
| Storing the auth token | Cookie — all modes |
| Protecting a private route | Set `route.meta.requiresAuth = true` |
| Preventing logged-in users from seeing login | Set `route.meta.requiresGuest = true` |
| Restricting to Admins (Advanced) | Set `route.meta.roles: ['admin']` |
| Making API calls during SSR | 🖥️ Forward cookies from the request |
| Making API calls from SPA | No extra config — browser sends cookies automatically |
| Protecting a server API route | Validate token in the server handler — all modes |
| Successful Login | `use-login` calls `setSession` |
| Invalidating session | `use-logout` calls `cleanSession` |
| Simple App (No roles) | Omit roles/permissions guards and constants |

## Execution Steps

1. Check requirements: ask if this is a **Simple** flow (just login/register) or an **Advanced** flow (roles, permissions, verify endpoint). Also identify the rendering mode.
2. Create the Pinia store (`modules/auth/stores/store-session.ts`) with cookie-backed token persistence.
3. Create the composable wrapper (`modules/auth/composables/use-session.ts`). Include `auth-roles.ts` integration only if Advanced.
4. Create the navigation guards (`modules/auth/guards/auth.ts`, `guest.ts`). Add `roles.ts` and `permissions.ts` only if Advanced. Register them in the router's `beforeEach`.
5. Create the authenticated API client (`modules/_core/api/clients/client-[name]-auth.ts`).
6. Implement the Auth API composables (`use-login`, `use-logout`, `use-register`) following `api-architecture`. Add `use-verify-session` if Advanced.
7. If the app has server API routes, add server-side session validation guards.

## Output Contract

Return:
- The bootstrapped authentication files.
- A brief architectural note confirming: (a) rendering mode, (b) Simple or Advanced flow, (c) guards created, (d) 🖥️ SSR cookie forwarding if applicable, (e) server API guards if applicable.

## References

- Pinia store: `modules/auth/stores/store-session.ts`
- Session composable: `modules/auth/composables/use-session.ts`
- Navigation guards: `modules/auth/guards/auth.ts`
- Auth roles constants: `modules/auth/constants/auth-roles.ts`
- API composable: `modules/auth/api/composables/use-login.ts`
- API architecture: see `api-architecture` skill
