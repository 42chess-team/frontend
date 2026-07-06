import { renderHook } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { useAuthStore } from "@/features/auth/stores/auth-store"

import { initAuth, useAuth } from "./use-auth"

const mockUser = {
  id: "1",
  email: "player@42chess.com",
  name: "Chess Player",
  avatar: null,
  provider: "google",
}

const server = setupServer(
  http.post("*/api/auth/login", () =>
    HttpResponse.json({
      accessToken: "mock-local-token",
      user: { ...mockUser, provider: "local" },
    }),
  ),
  http.post("*/api/auth/signup", () =>
    HttpResponse.json({
      accessToken: "mock-signup-token",
      user: { ...mockUser, provider: "local" },
    }),
  ),
  http.post("*/api/auth/callback", () =>
    HttpResponse.json({
      accessToken: "mock-access-token",
      user: mockUser,
    }),
  ),
  http.post("*/api/auth/refresh", () =>
    HttpResponse.json({
      accessToken: "mock-refreshed-token",
    }),
  ),
  http.get("*/api/auth/me", () => HttpResponse.json(mockUser)),
  http.get("*/api/auth/oauth/:provider", ({ params }) =>
    HttpResponse.json({
      url: `/api/auth/callback?provider=${params.provider}&code=mock-code`,
    }),
  ),
  http.post("*/api/auth/logout", () => HttpResponse.json({ message: "Logged out" })),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  useAuthStore.setState({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  })
})
afterAll(() => server.close())

describe("initAuth", () => {
  it("sets auth state on successful refresh", async () => {
    await initAuth()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBe("mock-refreshed-token")
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it("clears auth state on refresh failure", async () => {
    server.use(
      http.post("*/api/auth/refresh", () =>
        HttpResponse.json({ message: "Invalid" }, { status: 401 }),
      ),
    )

    await initAuth()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})

describe("useAuth", () => {
  it("localLogin sets auth state from email/password login", async () => {
    const { result } = renderHook(() => useAuth())
    await result.current.localLogin({
      email: "player@42chess.com",
      password: "password123",
    })
    const state = useAuthStore.getState()

    expect(state.accessToken).toBe("mock-local-token")
    expect(state.user?.provider).toBe("local")
    expect(state.isAuthenticated).toBe(true)
  })

  it("signup sets auth state from email/password signup", async () => {
    const { result } = renderHook(() => useAuth())
    await result.current.signup({
      email: "new@42chess.com",
      username: "new_player",
      displayName: "New Player",
      password: "password123",
    })
    const state = useAuthStore.getState()

    expect(state.accessToken).toBe("mock-signup-token")
    expect(state.user?.provider).toBe("local")
    expect(state.isAuthenticated).toBe(true)
  })

  it("normalizes backend auth response user fields for the frontend store", async () => {
    server.use(
      http.post("*/api/auth/login", () =>
        HttpResponse.json({
          accessToken: "backend-token",
          user: {
            id: "2",
            email: "backend@42chess.com",
            username: "backend_user",
            displayName: "Backend User",
            avatarUrl: "https://example.com/avatar.png",
          },
        }),
      ),
    )

    const { result } = renderHook(() => useAuth())
    await result.current.localLogin({
      email: "backend@42chess.com",
      password: "password123",
    })
    const state = useAuthStore.getState()

    expect(state.user).toEqual({
      id: "2",
      email: "backend@42chess.com",
      name: "Backend User",
      avatar: "https://example.com/avatar.png",
      provider: "local",
      username: "backend_user",
    })
  })

  it("logout clears auth state", async () => {
    useAuthStore.getState().setAuth("mock-token", mockUser)

    const { result } = renderHook(() => useAuth())
    await result.current.logout()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it("refresh updates token and user", async () => {
    const { result } = renderHook(() => useAuth())
    await result.current.refresh()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBe("mock-refreshed-token")
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it("refresh clears auth on failure", async () => {
    server.use(
      http.post("*/api/auth/refresh", () =>
        HttpResponse.json({ message: "Invalid" }, { status: 401 }),
      ),
    )

    useAuthStore.getState().setAuth("old-token", mockUser)

    const { result } = renderHook(() => useAuth())
    await result.current.refresh()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
