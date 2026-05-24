---
name: mutation-feedback
description: "Trigger: handle error, toast notification, mutation meta, API error. Enforce the global mutation feedback pattern instead of local UI states."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating or modifying an API mutation composable (e.g., `use-[action].ts`).
- Handling success or error toast notifications after form submissions or API calls.
- Refactoring Vue components that use manual `ref()` to track API errors or loading states.

## Hard Rules

- **1. No Local Error States for APIs**: Vue components MUST NOT use `ref()` or `reactive()` to manually track error strings or success flags from APIs. Delegate this entirely to the mutation composable.
- **2. The `meta` Object**: All mutations MUST define their user feedback text via the `meta` configuration object (`successMessage`, `errorMessage`, `showSuccessToast`).
- **3. Global Delegation**: Components MUST NOT call toast methods directly inside their submit handlers. The underlying global composable (or TanStack Vue Query `QueryClient` cache callbacks) will read the `meta` object and dispatch the UI notifications automatically.
- **4. Plugin Context Gotcha**: Global `QueryClient` callbacks run outside the Vue `setup` lifecycle. You CANNOT use the `useToast()` composable directly inside them (it will throw an error). You MUST use the plugin-injected adapter via `inject('toast')` or the app instance.
- **5. Toast Adapter**: When the global layer dispatches the notification, it MUST use the project's decoupled toast adapter. **NEVER** import a third-party toast library directly into mutation composables or components. See `adapter-pattern` skill.

## Decision Gates

| Need | Action |
|------|--------|
| Show a toast on success | Add `meta: { showSuccessToast: true, successMessage: '...' }` to the composable |
| Show a toast on failure | Add `meta: { errorMessage: '...' }` to the composable |
| Close a modal on success | Pass a custom `onSuccess` callback when calling the composable from the component |
| Disable a submit button | Use the `isPending` / `status` property returned by the composable |

## Execution Steps

1. In the API composable (`modules/[module]/api/composables/use-[action].ts`), configure the default `meta` object:
   ```typescript
   return useMutation({
     mutationFn: ...,
     meta: {
       showSuccessToast: true,
       successMessage: 'Operación exitosa',
       errorMessage: 'Error en la operación'
     },
     ...options
   })
   ```
2. In the Vue component (`Form[Name].vue`), consume the mutation composable and rely on the global layer to show the toasts. Do not import the toast library directly for API feedback.
3. In your Vue Query plugin (`modules/_core/plugins/vue-query.ts`), configure the `MutationCache` to read `meta` and trigger the toast via the injected adapter.
4. If the component needs to react (e.g., close a modal), pass an `onSuccess` override from the component, but let the `meta` object handle the notification.

## Output Contract

Return:
- The created/modified mutation composable including the `meta` configuration.
- A brief confirmation that any local `ref()` for error tracking in the Vue component was removed.

## References

- Toast adapter: `modules/_core/utils/toast/toast-adapter.ts`
- Toast composable: `modules/_core/utils/toast/use-toast.ts`
- See also: `adapter-pattern` skill
