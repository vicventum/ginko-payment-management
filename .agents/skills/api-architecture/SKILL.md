---
name: api-architecture
description: "Trigger: create api endpoint, fetch data, mutation, api composable. Implement the 5-layer API architecture pattern (Client, Provider, Type, Service, Composable)."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a new API endpoint integration.
- Creating data fetching composables or mutations.
- Refactoring existing, coupled API calls into a scalable architecture.

Do not use this pattern for simple local state management or non-network side effects.

## Hard Rules

- The architecture consists of 5 strict layers. Never bypass them:
   1. **Clients**: Base `$fetch` / `ofetch` configuration with interceptors. Located in `modules/[module]/api/clients/client-[name].ts`. Usually in `_core` module.
   2. **Providers**: Raw HTTP calls per endpoint. Located in `modules/[module]/api/providers/provider-[endpoint]-[client].ts`.
   3. **Types**: Response and payload types/schemas. Located in `modules/[module]/types/api/[TypeName].response.ts`.
   4. **Services**: Business logic layer. Consumes providers and validates data. Located in `modules/[module]/api/services/service-[name].ts`.
   5. **Composables**: Vue wrapper. Consumes services. Located in `modules/[module]/api/composables/use-[method]-[service].ts`.
- **Validation**: Services MUST validate responses. Use a utility like `utilCheckResponseSchema(resp, schema)` with Zod to ensure structural integrity (Anti-Corruption Layer) before returning to the UI.
- Keep each layer pure: Composables handle Vue reactivity and caching (TanStack Vue Query — see `data-fetching-strategy` skill for which strategy to use). Services handle business logic and structural validation. Providers handle the raw HTTP request. Clients handle headers and auth interception.

## Decision Gates

| Need | Action |
|------|--------|
| Base URL, Headers, Refresh Token Logic | Modify or create a **Client** |
| Hitting a specific endpoint (`/users`) | Create a **Provider** |
| Structural typing of the response | Create a **Type / Schema** |
| Validating or transforming the response | Do it in the **Service** |
| Loading states, caching, UI reactivity | Do it in the **Composable** |

## Execution Steps

1. **Client**: Identify if an existing client (e.g., `client-fetch-auth`) can be reused. If not, create a new `$fetch.create()` or `ofetch.create()` configuration.
2. **Provider**: Create the provider function. Example: `loginUser({ signal, payload })` calling the client.
3. **Type/Schema**: Define the Zod schema and export its inferred TypeScript type.
4. **Service**: Create the service function. It receives the provider as a parameter (Dependency Injection). Pass the result through `utilCheckResponseSchema(result, MySchema)`.
5. **Composable**: Choose the fetching strategy based on the `data-fetching-strategy` skill (TanStack `useQuery` / `useMutation` for cache-dependent data). Inject the provider into the service inside the function. Expose an options parameter to allow UI overrides (like `onSuccess`).

## Output Contract

Return:
- The created/modified files for Client (if any), Provider, Type, Service, and Composable.
- A brief explanation of the structural validation added in the Service layer.

## References

- Schema validation utility: `modules/_core/utils/util-check-response-schema.ts`
- Fetching strategy: see `data-fetching-strategy` skill
- Mutation feedback: see `mutation-feedback` skill
