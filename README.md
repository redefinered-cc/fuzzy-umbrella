# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Deploy Timestamp Footer

The app footer shows `Last deployed: ...` using the public environment variable
`VITE_DEPLOYED_AT`.

- Format input: ISO-8601 timestamp string (example: `2026-04-07T03:00:00Z`)
- Display format: UTC (`MMM DD, YYYY, HH:MM:SS UTC` in `en-US` locale)
- Fallback when missing/invalid: `Deploy time unavailable`

Set it in local development as needed:

```bash
VITE_DEPLOYED_AT="2026-04-07T03:00:00Z" npm run dev
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
