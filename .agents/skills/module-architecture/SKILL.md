---
name: module-architecture
description: "Trigger: module, architecture, vertical slicing, feature, ddd, layer, boundaries. Define strict Vue Module and Vertical Slicing architecture rules."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Create or evaluate project structure and module architecture when:
- Creating a new business domain (module)
- Adding a new feature to an existing module
- Deciding where to place components, composables, pages, or state
- Reviewing module boundaries and import paths

Do not use this skill for basic Vue component logic isolated from the architectural structure.

## Hard Rules

- **Vue Modules:** The project root does not contain business logic. All logic is encapsulated in `modules/` (e.g., `modules/_core/`, `modules/auth/`).
- **The Core Module:** `modules/_core/` acts as the root app layer. It contains global components, composables, HTTP clients (`api/clients`), global layouts, and `App.vue`.
- **Feature-Based Slicing:** Within a module (e.g., `modules/auth/`), code is grouped by Use Case in `features/[name]/`.
- **Strict Encapsulation:** A feature folder contains its own `components/`, `composables/`, and `api/` (`providers`, `services`, `composables` as per `api-architecture`). Cross-feature internal imports are strictly prohibited.
- **Dumb Pages & Co-location:** Each module has its own `pages/` and `layouts/` folders. Pages act as thin wrappers that import and render views from the `features/` layer.
- **The Public Contract:** Modules must expose their public API via a root `index.ts`. Other modules CANNOT deep-import files from inside another module; they must import from the `index.ts`. Internal pages can import directly from their own module's features.
- **Shared Code:** Code shared among multiple features in the same module goes into `modules/[module]/_shared/`.
- **Validation Folders (Conditional Rule):** If the project uses validation libraries like Zod or Valibot, use `schemas/` directories. If the project does not use them, use `validators/` directories containing pure validation functions.

## Decision Gates

| Need | Action |
|------|--------|
| Creating a new Use Case (e.g., Login) | Create a new feature in `modules/[module]/features/[name]/` |
| Code used ONLY by one feature | Place it inside the feature's specific folder (`features/[name]/utils/`, etc.) |
| Code shared among multiple features in the same module | Place it in `modules/[module]/_shared/` |
| Code shared across multiple modules | Place it in `modules/_core/` or export it via the source module's `index.ts` |
| Adding an endpoint / API call | Follow the `api-architecture` rules inside `features/[name]/api/` |

## Execution Steps

1. Identify the boundary of the change: Does it belong to an existing Feature, an existing Module (Shared), or is it Global (Core)?
2. If it is feature-specific, nest all its related parts (`components/`, `composables/`, `api/`, `stores/`, `utils/`, `types/`, `validators/` or `schemas/`) inside `features/[name]/`.
3. If it is shared within the module, place it in `modules/[module]/_shared/`.
4. Update the module's `index.ts` ONLY if the new feature needs to expose something to other modules.
5. Ensure the module's `pages/` directory correctly imports directly from the `features/` layer without containing business logic.

## Output Contract

Return:
- The generated folder structure or file placements adhering to the Vue Modules and Vertical Slicing rules.
- Explanation of why the specific placement was chosen based on the Scope (Feature vs Shared vs Core).

## References
