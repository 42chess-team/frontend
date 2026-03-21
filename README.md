# OnChess Frontend

온라인 체스 게임 프론트엔드

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷팅 |
| `npm run storybook` | Storybook 실행 |

## Tech Stack

- **Framework**: React 19, TypeScript, Vite 8
- **Routing**: TanStack Router (file-based)
- **Server State**: TanStack React Query + Axios
- **Client State**: Zustand
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI)
- **Form**: React Hook Form + Zod v4
- **API**: Orval (OpenAPI → 클라이언트 자동 생성)
- **Realtime**: Socket.IO
- **Chess**: chess.js + react-chessboard
- **i18n**: i18next
- **Testing**: Vitest, Storybook, Playwright

## Project Structure

```
src/
  features/           # 도메인별 기능 모듈 (auth, game, lobby, profile)
    {feature}/
      api/             # feature 전용 API
      components/      # feature 전용 컴포넌트
      hooks/           # feature 전용 hooks
      pages/           # feature 전용 페이지
      stores/          # feature 전용 zustand store
  components/          # 공통 UI (shadcn/ui, layout)
  hooks/               # 공통 hooks
  lib/                 # 유틸리티 (axios, utils)
  routes/              # TanStack Router 라우트 정의
  stores/              # 공통 zustand stores
docs/                  # 프로젝트 문서
```
