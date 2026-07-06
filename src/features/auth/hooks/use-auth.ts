import {
  authControllerGetMe,
  authControllerLogin,
  authControllerRefresh,
  authControllerSignup,
} from "@/api/auth/auth"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { axiosInstance } from "@/lib/axios"

type LocalLoginPayload = {
  email: string
  password: string
}

type LocalSignupPayload = LocalLoginPayload & {
  username: string
  displayName: string
}

type AuthResponseUser = {
  id: string
  email?: unknown
  name?: unknown
  displayName?: unknown
  username?: unknown
  avatar?: unknown
  avatarUrl?: unknown
  provider?: unknown
}

const asString = (value: unknown) => (typeof value === "string" ? value : undefined)

function normalizeAuthUser(user: AuthResponseUser) {
  const email = asString(user.email) ?? ""
  const username = asString(user.username)
  const name = asString(user.name) ?? asString(user.displayName) ?? username ?? email ?? "Player"
  const avatar = asString(user.avatar) ?? asString(user.avatarUrl) ?? null

  return {
    id: user.id,
    email,
    name,
    avatar,
    provider: asString(user.provider) ?? "local",
    ...(username ? { username } : {}),
  }
}

export function initAuth() {
  const { setAuth, clearAuth } = useAuthStore.getState()
  return authControllerRefresh()
    .then(async (data) => {
      const user = await authControllerGetMe({
        headers: { Authorization: `Bearer ${data.accessToken}` },
      })
      setAuth(data.accessToken, normalizeAuthUser(user))
    })
    .catch(() => {
      clearAuth()
    })
}

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore()

  const localLogin = async (payload: LocalLoginPayload) => {
    const data = await authControllerLogin(payload)
    setAuth(data.accessToken, normalizeAuthUser(data.user))
  }

  const signup = async (payload: LocalSignupPayload) => {
    const data = await authControllerSignup(payload)
    setAuth(data.accessToken, normalizeAuthUser(data.user))
  }

  const login = async (provider: string) => {
    if (provider !== "google") {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    if (import.meta.env.VITE_ENABLE_MSW === "true") {
      const { data } = await axiosInstance.post("/api/auth/callback", {
        provider,
        code: "mock-code",
      })
      setAuth(data.accessToken, normalizeAuthUser(data.user))
      return
    }

    window.location.href = "/auth/google/login"
  }

  const logout = async () => {
    await axiosInstance.post("/api/auth/logout")
    clearAuth()
  }

  const refresh = async () => {
    try {
      const data = await authControllerRefresh()
      const user = await authControllerGetMe({
        headers: { Authorization: `Bearer ${data.accessToken}` },
      })
      setAuth(data.accessToken, normalizeAuthUser(user))
    } catch {
      clearAuth()
    }
  }

  return { localLogin, signup, login, logout, refresh }
}
