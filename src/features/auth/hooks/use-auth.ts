import { useAuthStore } from "@/features/auth/stores/auth-store"
import { axiosInstance } from "@/lib/axios"

export function initAuth() {
  const { setAuth, clearAuth } = useAuthStore.getState()
  return axiosInstance
    .post("/api/auth/refresh")
    .then(async ({ data }) => {
      const { data: user } = await axiosInstance.get("/api/auth/me")
      setAuth(data.accessToken, user)
    })
    .catch(() => {
      clearAuth()
    })
}

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore()

  const login = async (provider: string) => {
    // 1. OAuth 리다이렉트 URL 요청
    const { data: oauthData } = await axiosInstance.get(`/api/auth/oauth/${provider}`)

    // 2. 실제 환경에서는 oauthData.url로 리다이렉트
    //    MSW 환경에서는 바로 callback 호출
    if (import.meta.env.VITE_ENABLE_MSW === "true") {
      const { data } = await axiosInstance.post("/api/auth/callback", {
        provider,
        code: "mock-code",
      })
      setAuth(data.accessToken, data.user)
    } else {
      window.location.href = oauthData.url
    }
  }

  const logout = async () => {
    await axiosInstance.post("/api/auth/logout")
    clearAuth()
  }

  const refresh = async () => {
    try {
      const { data } = await axiosInstance.post("/api/auth/refresh")
      const { data: user } = await axiosInstance.get("/api/auth/me")
      setAuth(data.accessToken, user)
    } catch {
      clearAuth()
    }
  }

  return { login, logout, refresh }
}
