# Testing Strategy

## 테스트 레이어

| 레이어 | 도구 | 대상 | 실행 |
|--------|------|------|------|
| Unit | Vitest + jsdom | 훅, 유틸, 스토어 로직 | `npx vitest run --project unit` |
| Component | Storybook | UI 컴포넌트 시각 확인 + 상태별 story | `npm run storybook` |
| E2E | Playwright | 유저 플로우 (백엔드 연동 후) | 미구현 |

## Unit Test

- 위치: feature 폴더 내 `*.test.ts` (e.g. `src/features/profile/hooks/use-profile.test.ts`)
- 환경: jsdom (`vite.config.ts`의 `unit` 프로젝트)
- setup: `src/test-setup.ts` (@testing-library/jest-dom 매처)
- API mocking: `msw/node`의 `setupServer` 사용

### 작성 기준

- TanStack Query 훅 → `renderHook` + MSW로 API mock
- Zustand 스토어 → 직접 `setState`/`getState` 호출
- 유틸 함수 → 순수 함수 테스트

### 패턴

```ts
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

const server = setupServer(
  http.get("*/api/...", () => HttpResponse.json(mockData)),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// QueryClient wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    QueryClientProvider({ client: queryClient, children })
}
```

## Storybook

- 위치: 컴포넌트와 같은 폴더에 `*.stories.tsx`
- MSW 연동: `msw-storybook-addon` (preview.ts에서 `initialize()` + `mswLoader`)
- i18n: preview.ts에서 `src/lib/i18n` import
- CSS: preview.ts에서 `src/index.css` import

### Story 작성 기준

각 컴포넌트마다 최소한 아래 상태를 커버:

- **Default** — 정상 데이터
- **Loading** — skeleton 상태 (`delay("infinite")` 활용)
- **Empty** — 데이터 없음 (해당되는 경우)
- **Edge case** — 에러, 이미지 로드 실패 등

### 패턴

```tsx
// API 의존 컴포넌트: decorator에서 매번 새 QueryClient 생성
decorators: [
  (Story) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  },
]

// MSW handler는 parameters.msw.handlers로 전달
parameters: {
  msw: {
    handlers: [
      http.get("*/api/...", () => HttpResponse.json(data)),
    ],
  },
}

// Zustand 의존 컴포넌트: decorator에서 setState
decorators: [
  (Story) => {
    useAuthStore.setState({ ... })
    return <Story />
  },
]
```

## E2E (미구현)

- 도구: Playwright
- 시점: 백엔드 API 연동 완료 후
- 대상: 로그인 → 로비 → 매칭 → 게임 플레이 등 주요 유저 플로우
