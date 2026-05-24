---
name: commit-architecture
description: "Trigger: git commit, commit message, push, version control, creating a commit. Enforce Conventional Commits with Gitmoji and backtick formatting for files."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a Git commit message.
- Executing `git commit -m` on behalf of the user.
- Formatting PR titles or change logs.

## Hard Rules

- **1. Conventional Commits**: Commits MUST strictly follow the `<type>[optional scope]: <description>` structure. Enforced by `commitlint` with `@commitlint/config-conventional`.
- **2. Gitmoji Integration**: Immediately after the colon and space, you MUST include the appropriate Gitmoji (following the https://gitmoji.dev/ standard).
- **3. File References**: Any time a file, component, or specific technical term is mentioned in the commit description, it MUST be wrapped in backticks (e.g., \`b-modal.vue\`).
- **4. No AI Attribution**: NEVER add "Co-Authored-By" or any AI signature to the commit.
- **5. Language**: The commit message MUST be written in Spanish, following the project's native language.
- **6. Length Limits**: Header max 125 chars, body max 500 chars per line (enforced by commitlint config).

## Decision Gates

| Need | Action |
|------|--------|
| New component in design system | `feat(components): ✨ Agrega componente \`b-dropdown-avatar.vue\`` |
| Bugfix in core atom | `fix(atoms): 🐛 Corrige tamaño incorrecto en \`a-pill.vue\`` |
| Refactoring a composable | `refactor(composites): ♻️ Simplifica props de \`c-modal-danger.vue\`` |
| Adding a Storybook story | `docs(stories): 📝 Agrega story para \`d-card-header.vue\`` |
| Build/config change | `chore(config): 🔧 Actualiza configuración del proyecto` |
| Change in API server | `feat(server): ✨ Agrega endpoint para validación de sesión` |
| Change in Route Middleware | `fix(middleware): 🐛 Corrige loop infinito en \`auth.ts\`` |
| Change in Vue Plugins | `feat(plugins): ✨ Agrega inyección global de toast` |

## Execution Steps

1. Identify the files changed and their corresponding scope (component category, module, config).
2. Determine the Conventional Commit type (`feat`, `fix`, `refactor`, `chore`, `docs`, `style`).
3. Select the matching Gitmoji.
4. Write the description in Spanish, ensuring all file names, functions, or variables are wrapped in backticks.
5. Provide the commit string or execute the commit directly if in CLI mode.

## Output Contract

Return:
- The exact git commit message generated.
- A brief verification that the format (Type + Scope + Gitmoji + Backticks) was strictly followed.
