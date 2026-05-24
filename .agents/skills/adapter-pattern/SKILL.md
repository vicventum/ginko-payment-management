---
name: adapter-pattern
description: "Trigger: third-party library, toast, analytics, date formatter, adapter. Enforce the Adapter Pattern to decouple external libraries from business logic."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Installing and implementing a new third-party library (e.g., toast notifications, date formatting, analytics tracking, HTTP clients).
- Refactoring UI components or services that directly import external packages.
- Creating global utilities that wrap external behaviors.

## Hard Rules

- **1. No Direct Imports**: Vue components and business logic (Services/Composables) MUST NEVER directly import a third-party library (e.g., `import { toast } from 'vue-sonner'`).
- **2. The Adapter Layer**: Create an adapter file (e.g., `toast-adapter.ts`) that imports the third-party library and maps its specific API to a generic, project-standard interface.
- **3. Consumer Composable/Utility**: Expose the adapter to the rest of the application through a composable (e.g., `useToast()`) or a pure utility function.

*Architectural Goal*: If the underlying third-party library is replaced in the future, ONLY the adapter file should change. Zero components or business logic files should need refactoring.

## Decision Gates

| Need | Action |
|------|--------|
| Using a UI notification library | Create `toast-adapter.ts` and expose via `use-toast.ts` |
| Formatting dates in UI | Create a `date-formatter.ts` utility wrapping `dayjs` |
| Tracking user events | Create an `analytics-adapter.ts` wrapping the tracking SDK |
| Calling the API | Use the `client-fetch-auth` factory (HTTP adapter) |

## The 4-Part Adapter Architecture

When integrating a complex library that requires initialization (like Toasts or Analytics), follow this structure inside `modules/_core/utils/[concept]/`:

1. **Constants (`constants.ts`)**: Define abstract enums for your app (e.g., `ToastPosition.TOP_CENTER`) so the app doesn't rely on third-party strings.
2. **Adapter (`[concept]-adapter.ts`)**: The ONLY file that imports the third-party library. It maps the external API to your generic interface and maps your abstract constants to the library's required format.
3. **Plugin (`[concept].plugin.ts`)**: If the library requires global initialization (e.g., registering a Vue plugin, providing a global instance), create a Vue plugin here. It MUST consume the adapter mappings (to avoid DRY violations) and expose them via `app.provide()`.
4. **Consumer Composable (`use-[concept].ts`)**: A clean composable that returns the adapter methods for Vue components to use natively (e.g., via `inject('toast')`).

## Output Contract

Return:
- The created Adapter file and Consumer composable/utility.
- A brief architectural confirmation that the Vue component is fully decoupled from the third-party dependency.

## References

- Example Composable: `modules/_core/utils/toast/use-toast.ts`
- Example Adapter: `modules/_core/utils/toast/toast-adapter.ts`
- Vue plugins: `modules/_core/plugins/`
