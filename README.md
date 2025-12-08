# CRM UI Mockup

Feature-oriented React 19 + Vite application with Tailwind, Redux Toolkit, and React Router.

## Project Layout

```
src/
  app/            # Store setup, global providers
  assets/         # Static assets (images, icons)
  components/     # Reusable UI primitives (e.g. Checkbox, SectionTitle)
  features/       # Feature modules (state + UI + hooks)
    searchProgram/
    sidebarStepper/
  layouts/        # Layout wrappers (reserved)
  pages/          # Route-level views
  routes/         # Router configuration
  services/       # API clients, mocks, mock data
  types/          # Cross-cutting TypeScript contracts
  utils/          # Shared helpers
```

### Feature Package Anatomy

Each folder within `src/features` mirrors the pattern below:

```
featureName/
  api/           # Feature-specific data hooks/services
  components/    # View building blocks
  hooks/         # Custom hooks scoped to the feature
  types.ts       # Domain contracts for the feature
  index.ts       # Barrel exposing public surface
```

- Export UI through `components/index.ts` and data APIs/types through `index.ts`.
- Keep state colocated with the feature (`slice.ts`, selectors, etc.).
- Share primitives via `src/components/common` and re-export from its `index.ts`.

## Path Aliases

Aliases are configured in `tsconfig.*.json` and `vite.config.ts`:

```
@/          → src/
@/app       → src/app
@/features  → src/features
@/components→ src/components
@/services  → src/services
... (etc.)
```

Use aliases instead of relative paths (`import { StepperHeader } from '@/features/sidebarStepper';`).

## Development Notes

- Components should rely on explicit interfaces exported from `types.ts`.
- Prefer barrels (`index.ts`) for cleaner imports and to declare the allowed surface of a folder.
- Add reusable UI patterns in `src/components/common` and consume them via the barrel.
- Keep feature routes thin—compose views in `src/pages` using feature modules only.

## Scripts

```
npm install       # install dependencies
npm run dev       # start Vite dev server
npm run build     # create production bundle
npm run lint      # run eslint
npm run cypress   # run test case
```
