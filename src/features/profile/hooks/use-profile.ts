// TODO: 백엔드 API 확정 후 Orval 자동생성 훅으로 교체
import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"

export type ProfileStats = {
  rating: number
  wins: number
  losses: number
  draws: number
}

export type GameResult = "win" | "loss" | "draw"

export type GameHistoryItem = {
  id: string
  opponent: { name: string; rating: number }
  result: GameResult
  ratingChange: number
  timeControl: string
  playedAt: string
}

export function useProfileStats() {
  return useQuery({
    queryKey: ["profile", "stats"],
    queryFn: () => api<ProfileStats>({ url: "/api/profile/stats" }),
  })
}

export function useGameHistory() {
  return useQuery({
    queryKey: ["profile", "games"],
    queryFn: () => api<GameHistoryItem[]>({ url: "/api/profile/games" }),
  })
}
