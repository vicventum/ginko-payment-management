---
name: style-architecture
description: "Trigger: style architecture, css rules, tailwind theming, colors, styles. Implement design system styles using semantic colors and UI component theming."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this skill when:
- Creating or modifying CSS styles, Tailwind classes, or design system tokens.
- Adjusting or extending the project's color palette and typographies.
- Theming UI components.

## Hard Rules

- **Modular Structure:** Rely on the layered architecture inside `app/assets/css/`. Use `settings/` for foundational styles (base, variables, colors, utilities) and `themes/` for component-specific configurations. `main.css` is the sole entry point.
- **Semantic Colors:** ALWAYS use semantic color roles (`primary`, `secondary`, `accent`, `success`, `info`, `warning`, `error`, `neutral`) instead of raw hex values or native Tailwind colors for components.
- **Color Overrides:** When extending or overriding colors in consumer applications via `app.config.ts`, you MUST define the full semantic color object. Do not leave the `colors` object empty or partially defined, as it will break component rendering.
- **Component Theming:** Do NOT create wrapper components just to override styles. Customize UI components directly through their respective theme configuration files in `app/assets/css/themes/components/` and export them via `themes/index.ts`.
- **CSS Variables:** To customize Tailwind's default values (e.g., typography, media queries), use `app/assets/css/settings/variables.css`. Base colors prefixed with `brand-` live in `colors.css`.

## Decision Gates

| Need | Action |
|------|--------|
| Add a brand new semantic color | Add to `colors.css` and register in the project's Tailwind config |
| Change an existing component's look | Edit its config in `app/assets/css/themes/components/` |
| Add a custom utility class | Place it in `app/assets/css/settings/utilities.css` |

## Output Contract

Return:
- Files created or modified inside `app/assets/css/` or configuration files.
- Confirmation that semantic colors and UI component themes are correctly preserved and exported.

## References

- `app/components/Architecture-of-Styles.mdx` — Full guide on Style Architecture.
