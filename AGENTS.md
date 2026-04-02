# AzamatAI Project Rules

## Mandatory Pre-Coding Review

Before starting any coding task in this repository, review these documents:
- [docs/azamatai-mvp-plan.md](/Users/aspanch1k/AzamatAI/docs/azamatai-mvp-plan.md)
- [docs/azamatai-frontend-engineering-preferences.md](/Users/aspanch1k/AzamatAI/docs/azamatai-frontend-engineering-preferences.md)

If a task touches frontend code, treat both documents as baseline project rules unless the user explicitly overrides them in the current request.

## Frontend Defaults

- Do not use Tailwind for this project.
- Prefer Vue 3 + Vite + Vue Router.
- Use Pinia only for truly global shared state.
- Use SCSS modules or scoped SCSS with shared design tokens.
- Keep architecture feature-first with a shared layer for UI, API, styles, types, and utilities.
- Keep route pages focused on composition and orchestration.
- Keep feature components responsible for module-specific UI, form state, and module logic.
- Keep shared UI components dumb and reusable, without business logic.
- Keep HTTP clients, request mapping, and response normalization outside components.
- Prefer Composition API with `script setup`.
- Prefer computed state over ref-plus-watch chains when deriving values.
- Lazy-load route pages and heavier modules where appropriate.

## Frontend Architecture Rules

Preferred structure:

```text
src/
  app/
  layouts/
  pages/
  features/
  entities/
  shared/
  stores/
```

Shared layer should contain:
- `shared/ui`
- `shared/api`
- `shared/lib`
- `shared/composables`
- `shared/types`
- `shared/styles`

## UI and Styling Rules

- Build a clean SaaS UI that is desktop-first for MVP.
- Prioritize clarity, spacing, typography, and calm hierarchy over decorative effects.
- Use shared tokens for colors, spacing, radius, shadows, z-index, and typography.
- Avoid large UI kits that reduce styling control.
- Avoid duplicated card, button, and input styling across pages.
- Keep only minimal global utility classes such as container or accessibility helpers.

## Performance Rules

- Trigger API requests from clear user actions, not unnecessary watchers.
- Avoid turning Pinia into a catch-all state bucket.
- Split large UI areas into smaller components with limited reactive coupling.
- Keep loading states lightweight.
- Avoid oversized universal form components if they hurt readability or optimization.

## Done Criteria For Frontend Work

- Routes and file structure are easy to scan.
- Components have one clear responsibility.
- Styles are reusable and not copy-pasted across pages.
- UI feels consistent, calm, and professional.
- Main pages load fast and major modules are responsive.
