# 42Chess Frontend

React/Vite frontend for the 42Chess online chess platform. The root `../README.md` is the evaluation source of truth.

## Setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

For real backend integration, set `VITE_ENABLE_MSW=false` and point `VITE_BACKEND_URL` to the backend when using the Vite dev proxy. The Docker/nginx frontend proxies `/api`, `/socket.io`, `/health`, and `/auth/google/*` to the backend service.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Vite development server |
| `pnpm build` | TypeScript + production build |
| `pnpm lint` | ESLint check |
| `pnpm test` | Vitest unit tests |
| `pnpm storybook` | Storybook |

## Tech Stack

- React 19, TypeScript, Vite 8
- TanStack Router and TanStack React Query
- Axios + Orval-generated OpenAPI clients
- Zustand auth state
- Tailwind CSS v4 and Radix/shadcn-style UI
- Socket.IO client for `/match` realtime chess
- chess.js + react-chessboard
- i18next English/Korean localization
- Vitest and Playwright-capable browser tooling
