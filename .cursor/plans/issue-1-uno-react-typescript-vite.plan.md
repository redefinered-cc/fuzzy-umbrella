# Issue #1 Plan: Scaffold an UNO app using React + TypeScript + Vite

## Context
- **Issue:** https://github.com/redefinered-cc/fuzzy-umbrella/issues/1
- **Title:** Scaffold an UNO app using React
- **Body:** Use React + Typescript + Vite
- **Current repository state:** Vite + React JavaScript template (`.jsx`), no TypeScript config, no tests.

## Problem Summary
The repository currently uses a JavaScript scaffold, while the issue requests a React + TypeScript + Vite UNO app scaffold. The immediate gap is tooling and structure alignment, plus replacing generic starter UI with UNO-focused starter screens/components.

## Current vs Expected
- **Current**
  - `src/main.jsx` and `src/App.jsx` entry/components
  - No `tsconfig.json` files
  - ESLint targets JS/JSX only
  - Generic Vite starter app content
- **Expected**
  - TypeScript-based entry and components (`.ts/.tsx`)
  - TypeScript configuration files for Vite workflow
  - Lint/build/dev working with TS
  - UNO-oriented scaffold UI and folder structure

## Assumptions
1. This issue asks for **scaffolding**, not a full playable UNO rules engine.
2. Vite remains the build tool.
3. No backend or database changes are required.
4. Basic UNO domain placeholders (table, discard pile, draw pile, player hand areas) are sufficient for this issue.

## In Scope
- Migrate app scaffold from JS/JSX to TS/TSX.
- Add TS configuration and align ESLint for TS.
- Replace generic starter UI with UNO-oriented app shell.
- Update README to describe new scaffold and usage.

## Out of Scope
- Full rule enforcement and turn system.
- Multiplayer/networking.
- Persistence (save/load game state).
- Production deployment pipeline work.

## Likely Files/Components
- Update: `package.json`, `package-lock.json`, `index.html`, `eslint.config.js`, `README.md`
- Rename/update: `src/main.jsx` -> `src/main.tsx`, `src/App.jsx` -> `src/App.tsx`
- Update/create: `src/App.css`, `src/index.css`, optional `src/features/uno/*`, `src/components/*`, `src/types/*`
- Add: `tsconfig.json` (and possibly `tsconfig.app.json`, `tsconfig.node.json`)

## Risks
- **Migration risk:** missed import/path updates during `.jsx` -> `.tsx` conversion can break build.
- **Tooling risk:** ESLint + TS parser/config mismatch can fail CI/linting.
- **Behavior risk:** if scope is interpreted as "playable UNO", scaffold-only delivery may be seen as incomplete.
- **Security/performance risk:** low for scaffold-level frontend changes.

## Implementation Steps (No Code in this Plan)
1. **Define scaffold depth**
   - Confirm this issue is scaffold-only and document what UNO placeholders are included.
   - Outcome: scope is explicit, avoids overbuilding.
2. **TypeScript baseline migration**
   - Add TS config and convert entry/component files to TS/TSX.
   - Outcome: app builds and runs with TS source.
3. **Linting/tooling alignment**
   - Update ESLint rules/config to support `.ts/.tsx`.
   - Outcome: lint passes on new TS code paths.
4. **UNO app shell scaffolding**
   - Replace generic starter UI with UNO domain shell and starter component structure.
   - Outcome: repository clearly reflects UNO app direction.
5. **Documentation update**
   - Refresh README with stack, structure, commands, and current limitations.
   - Outcome: contributors can run and extend scaffold without ambiguity.

## Test Plan
### Unit
- Component render checks for UNO shell sections and key controls.
- Type-level checks for core UNO domain types/interfaces.

### Integration/E2E
- Smoke test app boot/render under dev server.
- Verify no runtime console errors in initial scaffold interactions.
- Validate `npm run build` succeeds.

### Regression Checklist
- `npm install` works from lockfile.
- `npm run dev`, `npm run lint`, `npm run build` succeed.
- No stale `.jsx` imports or script references remain.
- README and project scripts match actual behavior.

### Edge/Failure Cases
- Empty initial game state does not crash the app shell.
- Invalid placeholder interactions are guarded/no-op.
- Strict TypeScript settings do not produce unresolved type errors.

## Validation and Rollout
### Local/Staging Verification
- Run dev/lint/build locally.
- Do manual browser sanity check for scaffold layout.

### Logs/Metrics/Alerts
- For scaffold scope, rely on CI/lint/build status and browser console checks.

### Rollout Strategy
- Merge as incremental commits (tooling, scaffold UI, docs).
- If any regression appears, revert the affected commit(s) cleanly.

## Delivery Plan
### Commit Sequence
1. `chore(ts): migrate react vite scaffold to typescript`
2. `chore(lint): update eslint config for ts/tsx`
3. `feat(uno): add initial uno app shell scaffold`
4. `docs(readme): document uno typescript vite scaffold`

### PR Checklist
- Issue linked and scope clarified (scaffold-only).
- Lint/build/dev commands verified.
- No dead assets/imports.
- README updated and accurate.

### Definition of Done
- Project is React + TypeScript + Vite.
- UNO-oriented scaffold is present and runnable.
- Tooling checks pass and documentation is current.

## Open Questions
1. Should this issue include any playable UNO logic beyond UI scaffolding?
2. Is a preferred state-management approach required now?
3. Should tests be introduced in this issue or separately?
