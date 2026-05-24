---
name: state-management-strategy
description: "Trigger: state management, pinia, tanstack, ref, reactive, store, cache, state. Define strict rules for state management in Vue."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Create or evaluate state management solutions when:
- Deciding where to store application data
- Creating a new Pinia store
- Fetching data from an API
- Defining local component state

Do not use this skill when dealing purely with CSS transitions or server-side only logic without state.

## Hard Rules

- **Pinia:** Use ONLY for global synchronous UI state (e.g., sidebar open, dark mode) and user session data. NEVER use Pinia to store or cache API responses.
- **TanStack Query:** Use for ALL Server State (API response caching, invalidation, fetching, loading states).
- **`ref()` / `reactive()`:** Use for purely local component state that does not need to be shared globally.
- Do not mix TanStack Query and raw fetch for the same data source.

## Decision Gates

| State Requirement | Solution |
|-------------------|----------|
| API responses, caching, loading states, background updates | TanStack Query |
| Global UI state (sidebar, theme), Auth session | Pinia |
| Local form inputs, toggle states within a single component | `ref()` / `reactive()` |

## Execution Steps

1. Analyze the state being managed (is it Server State, Global UI State, or Local State?).
2. Select the correct tool based on the Decision Gates.
3. If using Pinia, ensure the store only contains synchronous logic and no API fetch calls.
4. If using TanStack Query, ensure queries are properly keyed for caching and invalidation.
5. If using `ref()`, ensure it is not being prop-drilled excessively (if so, evaluate if it should be Pinia or `provide/inject`).

## Output Contract

Return:
- The implemented state logic using the strictly mandated tool.
- Explanation of why the specific tool was chosen based on the state type.

## References
