import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import type { GameHistoryItem, ProfileStats } from "./use-profile"
import { useGameHistory, useProfileStats } from "./use-profile"

const mockStats: ProfileStats = {
  rating: 1247,
  wins: 42,
  losses: 31,
  draws: 12,
}

const mockGames: GameHistoryItem[] = [
  {
    id: "g1",
    opponent: { name: "Magnus_42", rating: 1320 },
    result: "win",
    ratingChange: 15,
    timeControl: "5+0",
    playedAt: "2026-03-27T18:30:00Z",
  },
  {
    id: "g2",
    opponent: { name: "BobbyFischer99", rating: 1180 },
    result: "loss",
    ratingChange: -12,
    timeControl: "10+5",
    playedAt: "2026-03-26T14:00:00Z",
  },
]

const server = setupServer(
  http.get("*/api/profile/stats", () => HttpResponse.json(mockStats)),
  http.get("*/api/profile/games", () => HttpResponse.json(mockGames)),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    QueryClientProvider({ client: queryClient, children })
}

describe("useProfileStats", () => {
  it("fetches profile stats", async () => {
    const { result } = renderHook(() => useProfileStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockStats)
    expect(result.current.data?.rating).toBe(1247)
    expect(result.current.data?.wins).toBe(42)
  })

  it("handles error when API fails", async () => {
    server.use(
      http.get("*/api/profile/stats", () => HttpResponse.json({ message: "Unauthorized" }, { status: 401 })),
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

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].opponent.name).toBe("Magnus_42")
    expect(result.current.data?.[0].result).toBe("win")
    expect(result.current.data?.[1].result).toBe("loss")
  })

  it("handles empty game list", async () => {
    server.use(
      http.get("*/api/profile/games", () => HttpResponse.json([])),
    )

    const { result } = renderHook(() => useGameHistory(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })
})
