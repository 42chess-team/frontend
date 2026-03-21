import { HttpResponse, http } from "msw"

const mockUser = {
  id: "1",
  email: "player@onchess.com",
  name: "Chess Player",
  avatar: null,
  provider: "google",
}

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
]
