---
name: form-architecture
description: "Trigger: create form, add inputs, form validation, form submit. Implement the Smart Form / Dumb Fields architectural pattern for Vue."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a new form that requires validation or API submission.
- Refactoring a large, monolithic form into maintainable pieces.
- Adding fields to an existing complex form.

Do not use this pattern for a simple single-input UI component (like a navbar search bar).

## Hard Rules

- The architecture splits forms into two strict layers: `Form` (Smart) and `Fields` (Dumb).
- **1. Form (Smart Container)**:
   - Located in `modules/[module]/components/form/Form[Name].vue`.
   - Responsibilities: Initialize form state (reactive object), define the Zod validation schema, wrap content in a form component that provides validation context, call API mutation composables, handle `onSubmit`, and render the action buttons.
   - Owns the `ref()` for form state and the schema definition.
- **2. Fields (Dumb Presentation)**:
   - Located in `modules/[module]/components/fields/Fields[Name].vue`.
   - Responsibilities: Render the form fields using `<FormField>` wrappers around inputs, and handle the internal grid layout/margins between inputs.
   - **Constraint**: `Fields` components MUST NOT contain business logic, API calls, or submit buttons. They receive the form state cleanly via Vue 3's `const state = defineModel()`.
   - **Validation Context**: The parent form provides validation context via `provide/inject`, so error messages are automatically detected in child fields. No error props are needed.
   - **Reusable Nested Fields (Advanced)**: If a `Fields` component is meant to be reused inside larger schemas (e.g. `FieldsAddress`), expose a `pathPrefix` prop so the field names can be dynamic.

## Decision Gates

| Need | Action |
|------|--------|
| API submission, validation schema, submit button | Do it in the **Form** component |
| Rendering inputs, setting up a 2-column grid | Do it in the **Fields** component |
| Connecting inputs to form state | Pass `state` as `v-model` from Form to Fields, or bind individual fields |
| Showing validation errors | Handled automatically by the form validation provider + schema. No manual error tracking. |

## Execution Steps

1. Create the `Fields[Name].vue` component in `modules/[module]/components/fields/`. Expose the form state using `const state = defineModel()`. Design the layout using form field wrappers + input components.
2. If the fields represent a nested object in your Zod schema, add a `pathPrefix: string` prop and bind the names dynamically.
3. Create the `Form[Name].vue` component in `modules/[module]/components/form/`. Define the reactive `state` object and the Zod schema.
4. Inside `Form[Name]`, wrap content in a validation form provider, render the `<Fields[Name] v-model="state" />` component, and place action buttons at the bottom.
5. Hook up the `onSubmit` handler to the API mutation composable. Use the `meta` object for toast feedback (see `mutation-feedback` skill).

## Output Contract

Return:
- The created/modified `Form` and `Fields` components.
- A brief explanation verifying that the `Fields` component remains purely presentational and that validation is schema-driven (not manual).

## References

- Mutation feedback: see `mutation-feedback` skill
