# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy Time Footer

The app footer displays the most recent production deploy timestamp when the build-time environment variable `VITE_LAST_DEPLOYED_AT` is set.

- Expected format: ISO-8601 timestamp (for example, `2026-03-31T12:34:56Z`)
- Display format: UTC (`Last deployed: Mar 31, 2026, 12:34:56 UTC`)
- Fallback: `Deploy time unavailable` when the value is missing or invalid

Example:

```bash
VITE_LAST_DEPLOYED_AT=2026-03-31T12:34:56Z npm run dev
```
