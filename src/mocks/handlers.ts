import { HttpResponse, http } from "msw"

const mockUser = {
  id: "1",
  email: "player@42chess.com",
  name: "Chess Player",
  avatar: null,
  provider: "google",
}

const mockStats = {
  rating: 1247,
  wins: 42,
  losses: 31,
  draws: 12,
}

const mockGames = [
  {
    id: "g1",
    opponent: { name: "Magnus_42", rating: 1320 },
    result: "win" as const,
    ratingChange: +15,
    timeControl: "5+0",
    playedAt: "2026-03-27T18:30:00Z",
  },
  {
    id: "g2",
    opponent: { name: "BobbyFischer99", rating: 1180 },
    result: "loss" as const,
    ratingChange: -12,
    timeControl: "10+5",
    playedAt: "2026-03-26T14:00:00Z",
  },
  {
    id: "g3",
    opponent: { name: "ChessNoob", rating: 1050 },
    result: "win" as const,
    ratingChange: +8,
    timeControl: "3+0",
    playedAt: "2026-03-25T20:15:00Z",
  },
  {
    id: "g4",
    opponent: { name: "QueenGambit", rating: 1290 },
    result: "draw" as const,
    ratingChange: +2,
    timeControl: "5+3",
    playedAt: "2026-03-24T11:00:00Z",
  },
  {
    id: "g5",
    opponent: { name: "PawnStar", rating: 1150 },
    result: "win" as const,
    ratingChange: +10,
    timeControl: "10+0",
    playedAt: "2026-03-23T09:45:00Z",
  },
]

let isAuthenticated = false

export const handlers = [
  // OAuth 리다이렉트 URL 반환
  http.get("*/api/auth/oauth/:provider", ({ params }) => {
    const { provider } = params
    return HttpResponse.json({
      url: `/api/auth/callback?provider=${provider}&code=mock-code`,
    })
  }),

  // OAuth 콜백 → ATK 반환
  http.post("*/api/auth/callback", async () => {
    isAuthenticated = true
    return HttpResponse.json({
      accessToken: "mock-access-token",
      user: mockUser,
    })
  }),

  // RTK로 ATK 재발급
  http.post("*/api/auth/refresh", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Invalid refresh token" }, { status: 401 })
    }
    return HttpResponse.json({
      accessToken: "mock-access-token-refreshed",
    })
  }),

  // 로그아웃
  http.post("*/api/auth/logout", () => {
    isAuthenticated = false
    return HttpResponse.json({ message: "Logged out" })
  }),

  // 현재 유저 정보
  http.get("*/api/auth/me", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json(mockUser)
  }),

  // 프로필 통계
  http.get("*/api/profile/stats", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json(mockStats)
  }),

  // 최근 게임 히스토리
  http.get("*/api/profile/games", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json(mockGames)
  }),
]
