# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy Timestamp Footer

The app footer reads deploy metadata from `VITE_DEPLOYED_AT` and displays:

- `Last deployed: <timestamp>` when `VITE_DEPLOYED_AT` contains a valid ISO-8601 timestamp.
- `Last deployed: Deploy time unavailable` when the variable is missing or invalid.

The timestamp is rendered in **UTC** for consistency (for example, `Apr 7, 2026, 4:20 AM UTC`).

### Local development

Run the app with deploy metadata:

```bash
VITE_DEPLOYED_AT=2026-04-07T04:20:00Z npm run dev
```

Run without metadata to verify fallback:

```bash
npm run dev
```
