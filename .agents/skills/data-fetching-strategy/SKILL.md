---
name: data-fetching-strategy
description: "Trigger: TanStack Query, vue-query, data fetching, cache, mutation, $fetch. Choose between native $fetch and TanStack Query."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Deciding how to fetch or mutate server data in a Vue component or composable.
- Setting up `@tanstack/vue-query` in a Vue project for the first time.
- Choosing between native `fetch`/`$fetch` and TanStack Query for a specific use case.

## Hard Rules

- **1. Never Mix for the Same Data**: A single piece of data MUST have ONE source of truth. Choose one strategy per data source.
- **2. Use `$fetch` Inside `queryFn`**: When TanStack Query calls API routes (`/api/...`), always use `$fetch` — it provides consistent interceptor behavior.
- **3. Encapsulate in Composables**: All data fetching logic MUST live in composables (see `api-architecture` skill), never inline in components.
- **4. SSR Plugin is Mandatory**: If the app uses SSR, TanStack Query MUST be configured via a Vue plugin with per-request `QueryClient` on the server and proper `dehydrate`/`hydrate` to prevent data leakage between users.

### When to Use `$fetch` / Direct Fetch

Use for data that is:
- **SSR-critical**: SEO content, initial page data that must be in the HTML payload (only relevant if the project uses SSR).
- **Simple reads**: Straightforward GET requests without complex cache relationships.

Advantages: zero dependencies, no extra setup.

### When to Use TanStack Query (Vue Query)

Use for data that is:
- **Mutation-heavy**: CRUD operations that need `useMutation` with `onSuccess`, `onError`, `meta`.
- **Cache-dependent**: Multiple components read/write the same data and need `invalidateQueries` for synchronization.
- **Interactive**: Requires optimistic updates, background refetching, polling, or infinite scroll.
- **Dashboard/SPA**: Admin panels, dashboards, or any view where real-time freshness matters.

Advantages: `useMutation`, key-based cache invalidation, `staleTime` / `refetchOnWindowFocus`, optimistic updates, devtools.

## Decision Gates

| Need | Tool |
|------|------|
| SEO-critical page data (blog post, product page — SSR only) | `$fetch` in server hooks / TanStack with SSR |
| Form submission, create/update/delete | TanStack `useMutation` |
| List that refreshes after a sibling mutation | TanStack `useQuery` + `invalidateQueries` |
| Dashboard widget polling every 30s | TanStack `useQuery` with `refetchInterval` |
| Simple one-off GET with no cache needs | `$fetch` |
| Infinite scroll / pagination | TanStack `useInfiniteQuery` |
| Auth session verification on app load | TanStack `useQuery` or custom plugin |

## Execution Steps — TanStack Query Setup

1. Install `@tanstack/vue-query`.
2. Create the Vue plugin (`modules/_core/plugins/vue-query.ts`):
   ```typescript
   import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'
   import type { App } from 'vue'

   export default {
     install: (app: App) => {
       const queryClient = new QueryClient({
         defaultOptions: { queries: { staleTime: 5000 } }
       })

       app.use(VueQueryPlugin, { queryClient })

       // SSR hydration — only relevant if the project uses SSR
       if (typeof window === 'undefined') {
         // Store dehydrated state on the server
         ;(app as any).payload = { vueQueryState: dehydrate(queryClient) }
       }
     }
   }
   ```
3. Configure global mutation callbacks in the `QueryClient` to read `meta` and dispatch toast notifications (see `mutation-feedback` skill).
4. Write composables following `api-architecture`: `queryFn` calls the service, which calls the provider, which uses `$fetch`.

## Output Contract

Return:
- Which fetching strategy was chosen and why.
- If TanStack Query: confirmation that the plugin is configured.
- If `$fetch`: confirmation that no manual cache invalidation is needed.

## References

- TanStack Vue Query: `@tanstack/vue-query`
- Plugin location: `modules/_core/plugins/vue-query.ts`
- Mutation feedback pattern: see `mutation-feedback` skill
- API layer: see `api-architecture` skill
