# 42Chess Frontend

온라인 체스 게임 프론트엔드 프로젝트.

## Tech Stack

- React 19, TypeScript, Vite
- TanStack Router (file-based routing, auto code splitting)
- TanStack React Query
- Zustand (상태 관리)
- Tailwind CSS v4, shadcn/ui (Radix UI)
- Axios + Orval (API 클라이언트 자동 생성)
- Zod (스키마 검증)
- react-hook-form + @hookform/resolvers
- Socket.IO (실시간 통신)
- chess.js + react-chessboard
- i18next (다국어)
- Storybook, Vitest, Playwright (테스트)

## Commands

- `npm run dev` — 개발 서버
- `npm run build` — 빌드
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` — Prettier
- `npm run storybook` — Storybook 실행

## Project Structure (Feature-based)

```
src/
  features/         # 도메인별 기능 모듈
    auth/
    game/
    lobby/
    profile/
      api/           # feature 전용 API 호출
      components/    # feature 전용 컴포넌트
      hooks/         # feature 전용 hooks
      pages/         # feature 전용 페이지
      stores/        # feature 전용 zustand store
  components/        # 공통 UI 컴포넌트
    ui/              # shadcn/ui 컴포넌트
    layout/          # Header, Footer, Sidebar, Layout 등
  hooks/             # 공통 hooks
  lib/               # 유틸리티 (axios 인스턴스, utils)
  routes/            # TanStack Router 라우트 정의
  stores/            # 공통 zustand stores
  stories/           # Storybook stories
```

### 구조 규칙

- feature 내부에서만 쓰이는 코드는 해당 feature 폴더 안에 위치
- 2개 이상 feature에서 공유하는 코드는 `src/` 최상위 공통 폴더로 이동
- API 클라이언트는 Orval로 자동 생성, custom axios 인스턴스는 `src/lib/axios.ts`
- 경로 alias: `@` → `src/`

## 기능별 개발 사이클

1. **기획** — 기능 요구사항 정의, 페이지/컴포넌트 구조 설계
2. **API 계약** — Backend와 OpenAPI 스펙 합의 → Orval로 API 클라이언트 + Zod 스키마 자동 생성
3. **컴포넌트 작성** — UI 컴포넌트는 Storybook으로 독립 개발, 페이지 조합 + API 연동은 MSW로 mock
4. **테스트** — Storybook interaction test (컴포넌트 단위), Vitest (비즈니스 로직, hooks)
5. **통합** — 실제 API 연결 + E2E 확인

## Key Conventions

- API 훅은 Orval이 자동생성 — 수동으로 fetch 함수 작성 금지
- 서버 상태는 TanStack Query, 클라이언트 상태는 Zustand
- 폼은 React Hook Form + Zod resolver
- 라우팅은 TanStack Router (파일 기반, routeTree.gen.ts 자동 생성)
- i18n 키는 feature별 네임스페이스 분리

## Gotchas

- Zod v4 사용 중 — v3 문법과 다름
- Vite 8 사용 중 — Storybook과 peer dependency 경고 있으나 동작함
- 체스 로직은 chess.js로 처리, 직접 구현 금지

## Docs

- [docs/auth.md](docs/auth.md) — 인증 플로우 (JWT, OAuth 등)
- [docs/api.md](docs/api.md) — API 스펙/계약 관련 가이드
- [docs/game.md](docs/game.md) — 체스 게임 로직, Socket.IO 이벤트 정의
- [docs/i18n.md](docs/i18n.md) — 다국어 키 관리 규칙
