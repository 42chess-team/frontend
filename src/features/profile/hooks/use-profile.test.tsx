import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import type { GameHistoryItem, ProfileStats } from "./use-profile"
import {
  useGameHistory,
  useProfileStats,
  usePublicGameHistory,
  usePublicProfile,
  usePublicProfileStats,
} from "./use-profile"

const mockUser = {
  id: "1",
  email: "player@42chess.com",
  username: "chess_player",
  displayName: "Chess Player",
  avatarUrl: null,
  createdAt: "2026-03-01T00:00:00Z",
  ratings: [{ timeControl: "RAPID", rating: 1247, gamesPlayed: 85 }],
  usernameChangedAt: null,
}

const mockMatches = [
  {
    id: "g1",
    opponent: { username: "magnus_42", displayName: "Magnus_42", avatarUrl: null },
    color: "WHITE",
    result: "WIN",
    absoluteResult: "WHITE_WIN",
    resultReason: "CHECKMATE",
    timeControl: "BLITZ",
    initialTimeSeconds: 300,
    incrementSeconds: 0,
    ratingBefore: 1232,
    ratingAfter: 1247,
    ratingDelta: 15,
    startedAt: "2026-03-27T18:20:00Z",
    endedAt: "2026-03-27T18:30:00Z",
  },
  {
    id: "g2",
    opponent: { username: "bobby_fischer_99", displayName: "BobbyFischer99", avatarUrl: null },
    color: "BLACK",
    result: "LOSS",
    absoluteResult: "WHITE_WIN",
    resultReason: "RESIGN",
    timeControl: "RAPID",
    initialTimeSeconds: 600,
    incrementSeconds: 5,
    ratingBefore: 1259,
    ratingAfter: 1247,
    ratingDelta: -12,
    startedAt: "2026-03-26T13:45:00Z",
    endedAt: "2026-03-26T14:00:00Z",
  },
]

const mockStats: ProfileStats = {
  rating: 1247,
  wins: 1,
  losses: 1,
  draws: 0,
}

const mockGames: GameHistoryItem[] = [
  {
    id: "g1",
    opponent: { name: "Magnus_42", rating: 1232 },
    result: "win",
    ratingChange: 15,
    timeControl: "5+0",
    playedAt: "2026-03-27T18:30:00Z",
  },
  {
    id: "g2",
    opponent: { name: "BobbyFischer99", rating: 1259 },
    result: "loss",
    ratingChange: -12,
    timeControl: "10+5",
    playedAt: "2026-03-26T14:00:00Z",
  },
]

const paginatedMatches = (items = mockMatches) => ({
  items,
  total: items.length,
  page: 1,
  pageSize: 10,
  hasNext: false,
})

const server = setupServer(
  http.get("*/api/users/me", () => HttpResponse.json(mockUser)),
  http.get("*/api/users/:username", ({ params }) =>
    HttpResponse.json({
      ...mockUser,
      id: "public-1",
      email: undefined,
      username: params.username,
      displayName: "Public Player",
    }),
  ),
  http.get("*/api/users/:username/matches", () => HttpResponse.json(paginatedMatches())),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useProfileStats", () => {
  it("fetches profile stats from real users and matches contracts", async () => {
    const { result } = renderHook(() => useProfileStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockStats)
    expect(result.current.data?.rating).toBe(1247)
    expect(result.current.data?.wins).toBe(1)
  })

  it("handles error when API fails", async () => {
    server.use(
      http.get("*/api/users/me", () =>
        HttpResponse.json({ message: "Unauthorized" }, { status: 401 }),
      ),
    )

    const { result } = renderHook(() => useProfileStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe("useGameHistory", () => {
  it("fetches game history", async () => {
    const { result } = renderHook(() => useGameHistory(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockGames)
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].opponent.name).toBe("Magnus_42")
    expect(result.current.data?.[0].result).toBe("win")
    expect(result.current.data?.[1].result).toBe("loss")
  })

  it("handles empty game list", async () => {
    server.use(
      http.get("*/api/users/:username/matches", () => HttpResponse.json(paginatedMatches([]))),
    )

    const { result } = renderHook(() => useGameHistory(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})

describe("public profile hooks", () => {
  it("fetches a public profile by username", async () => {
    const { result } = renderHook(() => usePublicProfile("public_player"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.username).toBe("public_player")
    expect(result.current.data?.displayName).toBe("Public Player")
    expect(result.current.data).not.toHaveProperty("email")
  })

  it("fetches public profile stats and game history", async () => {
    const { result: stats } = renderHook(() => usePublicProfileStats("public_player"), {
      wrapper: createWrapper(),
    })
    const { result: games } = renderHook(() => usePublicGameHistory("public_player"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(stats.current.isSuccess).toBe(true))
    await waitFor(() => expect(games.current.isSuccess).toBe(true))

    expect(stats.current.data).toEqual(mockStats)
    expect(games.current.data).toEqual(mockGames)
  })
})
