import { beforeEach, describe, expect, it } from "vitest"

import { useAuthStore } from "./auth-store"

const mockUser = {
  id: "1",
  email: "test@42chess.com",
  name: "Test User",
  avatar: null,
  provider: "google",
}

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    })
  })

  it("has correct initial state", () => {
    const state = useAuthStore.getState()

    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it("setAuth sets token, user, and isAuthenticated", () => {
    useAuthStore.getState().setAuth("mock-token", mockUser)
    const state = useAuthStore.getState()

    expect(state.accessToken).toBe("mock-token")
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it("clearAuth resets all auth state", () => {
    useAuthStore.getState().setAuth("mock-token", mockUser)
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()

    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
