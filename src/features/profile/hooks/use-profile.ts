import { useQuery } from "@tanstack/react-query"

import { matchControllerGetUserHistory } from "@/api/matches/matches"
import { usersControllerGetByUsername, usersControllerGetMe } from "@/api/users/users"

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

const toGameResult = (result: string): GameResult => {
  if (result === "WIN") return "win"
  if (result === "LOSS") return "loss"
  return "draw"
}

const formatTimeControl = (initialTimeSeconds: number, incrementSeconds: number) => {
  const minutes = Math.floor(initialTimeSeconds / 60)
  return `${minutes}+${incrementSeconds}`
}

const statsFromHistory = (
  rating: number | undefined,
  history: Awaited<ReturnType<typeof matchControllerGetUserHistory>>,
): ProfileStats => ({
  rating: rating ?? 1200,
  wins: history.items.filter((match) => match.result === "WIN").length,
  losses: history.items.filter((match) => match.result === "LOSS").length,
  draws: history.items.filter((match) => match.result === "DRAW").length,
})

const historyToGameItems = (
  history: Awaited<ReturnType<typeof matchControllerGetUserHistory>>,
): GameHistoryItem[] =>
  history.items.map((match) => ({
    id: match.id,
    opponent: {
      name: match.opponent.displayName || match.opponent.username,
      rating: match.ratingAfter - match.ratingDelta,
    },
    result: toGameResult(match.result),
    ratingChange: match.ratingDelta,
    timeControl: formatTimeControl(match.initialTimeSeconds, match.incrementSeconds),
    playedAt: match.endedAt,
  }))

export function useProfileStats() {
  return useQuery({
    queryKey: ["profile", "stats"],
    queryFn: async (): Promise<ProfileStats> => {
      const me = await usersControllerGetMe()
      const history = await matchControllerGetUserHistory(me.username, { page: 1, pageSize: 100 })
      const rapidOrFirstRating =
        me.ratings.find((rating) => rating.timeControl === "RAPID") ?? me.ratings[0]

      return statsFromHistory(rapidOrFirstRating?.rating, history)
    },
  })
}

export function useGameHistory() {
  return useQuery({
    queryKey: ["profile", "games"],
    queryFn: async (): Promise<GameHistoryItem[]> => {
      const me = await usersControllerGetMe()
      const history = await matchControllerGetUserHistory(me.username, { page: 1, pageSize: 10 })

      return historyToGameItems(history)
    },
  })
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["profile", "public", username],
    enabled: username.length > 0,
    queryFn: () => usersControllerGetByUsername(username),
  })
}

export function usePublicProfileStats(username: string) {
  return useQuery({
    queryKey: ["profile", "public", username, "stats"],
    enabled: username.length > 0,
    queryFn: async (): Promise<ProfileStats> => {
      const profile = await usersControllerGetByUsername(username)
      const history = await matchControllerGetUserHistory(username, { page: 1, pageSize: 100 })
      const rapidOrFirstRating =
        profile.ratings.find((rating) => rating.timeControl === "RAPID") ?? profile.ratings[0]

      return statsFromHistory(rapidOrFirstRating?.rating, history)
    },
  })
}

export function usePublicGameHistory(username: string) {
  return useQuery({
    queryKey: ["profile", "public", username, "games"],
    enabled: username.length > 0,
    queryFn: async (): Promise<GameHistoryItem[]> => {
      const history = await matchControllerGetUserHistory(username, { page: 1, pageSize: 10 })
      return historyToGameItems(history)
    },
  })
}
