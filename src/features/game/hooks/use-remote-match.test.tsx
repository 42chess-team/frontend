import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { useAuthStore } from "@/features/auth/stores/auth-store"

import type { MatchEndedEvent, MatchMoveMadeEvent, MatchStateEvent } from "./use-remote-match"
import { useRemoteMatch } from "./use-remote-match"

const socketMock = vi.hoisted(() => {
  type Handler = (payload: unknown) => void
  const handlers = new Map<string, Handler>()
  const emit = vi.fn()
  const disconnect = vi.fn()
  const off = vi.fn((event: string, handler: Handler) => {
    if (handlers.get(event) === handler) handlers.delete(event)
  })
  const on = vi.fn((event: string, handler: Handler) => {
    handlers.set(event, handler)
  })
  return {
    handlers,
    emit,
    disconnect,
    off,
    on,
    io: vi.fn(() => ({ emit, disconnect, off, on })),
  }
})

vi.mock("socket.io-client", () => ({
  io: socketMock.io,
}))

const activeMatch = {
  matchId: "m-active",
  whiteUserId: "u-white",
  blackUserId: "u-black",
  turn: "white",
  timeControl: "BLITZ",
  initialTimeSeconds: 300,
  incrementSeconds: 3,
  whiteClockMs: 299000,
  blackClockMs: 300000,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  pgn: "",
  startedAt: "2026-04-19T06:00:00.000Z",
  turnStartedAt: "2026-04-19T06:00:00.000Z",
} as const

const server = setupServer(
  http.get("*/api/matches/active", () => HttpResponse.json({ match: activeMatch })),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false })
  socketMock.handlers.clear()
  socketMock.emit.mockClear()
  socketMock.disconnect.mockClear()
  socketMock.off.mockClear()
  socketMock.on.mockClear()
  socketMock.io.mockClear()
})
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useRemoteMatch", () => {
  it("returns an empty active match state when REST discovery has no active match", async () => {
    server.use(http.get("*/api/matches/active", () => HttpResponse.json({ match: null })))
    useAuthStore.setState({
      accessToken: "token",
      user: {
        id: "u-white",
        email: "w@example.com",
        name: "White",
        avatar: null,
        provider: "local",
      },
      isAuthenticated: true,
    })

    const { result } = renderHook(() => useRemoteMatch(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.activeQuery.isSuccess).toBe(true))

    expect(result.current.matchState).toBeNull()
    expect(result.current.hasActiveMatch).toBe(false)
    expect(socketMock.io).not.toHaveBeenCalled()
  })

  it("connects to /match and applies state events as authoritative board state", async () => {
    useAuthStore.setState({
      accessToken: "token",
      user: {
        id: "u-white",
        email: "w@example.com",
        name: "White",
        avatar: null,
        provider: "local",
      },
      isAuthenticated: true,
    })

    const { result } = renderHook(() => useRemoteMatch(), { wrapper: createWrapper() })

    await waitFor(() => expect(socketMock.io).toHaveBeenCalledWith("/match", expect.any(Object)))

    const nextState: MatchStateEvent = {
      ...activeMatch,
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
      pgn: "1. e4",
      turn: "black",
      whiteClockMs: 298500,
    }

    act(() => socketMock.handlers.get("state")?.(nextState))

    expect(result.current.matchState?.fen).toBe(nextState.fen)
    expect(result.current.matchState?.turn).toBe("black")
    expect(result.current.matchState?.whiteClockMs).toBe(298500)
  })

  it("emits server move payloads without mutating local state before confirmation", async () => {
    useAuthStore.setState({
      accessToken: "token",
      user: {
        id: "u-white",
        email: "w@example.com",
        name: "White",
        avatar: null,
        provider: "local",
      },
      isAuthenticated: true,
    })

    const { result } = renderHook(() => useRemoteMatch(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.matchState?.matchId).toBe("m-active"))
    const fenBefore = result.current.matchState?.fen

    act(() => {
      expect(result.current.emitMove({ from: "e2", to: "e4", promotion: "q" })).toBe(true)
    })

    expect(socketMock.emit).toHaveBeenCalledWith("move", {
      matchId: "m-active",
      from: "e2",
      to: "e4",
      promotion: "q",
    })
    expect(result.current.matchState?.fen).toBe(fenBefore)

    const moveEvent: MatchMoveMadeEvent = {
      matchId: "m-active",
      san: "e4",
      from: "e2",
      to: "e4",
      promotion: null,
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
      turn: "black",
      whiteClockMs: 299500,
      blackClockMs: 300000,
    }
    act(() => socketMock.handlers.get("move:made")?.(moveEvent))

    expect(result.current.matchState?.fen).toBe(moveEvent.fen)
  })

  it("emits resign payload and stops moves after match ended", async () => {
    useAuthStore.setState({
      accessToken: "token",
      user: {
        id: "u-white",
        email: "w@example.com",
        name: "White",
        avatar: null,
        provider: "local",
      },
      isAuthenticated: true,
    })

    const { result } = renderHook(() => useRemoteMatch(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.matchState?.matchId).toBe("m-active"))

    act(() => {
      expect(result.current.resign()).toBe(true)
    })

    expect(socketMock.emit).toHaveBeenCalledWith("resign", { matchId: "m-active" })

    const ended: MatchEndedEvent = {
      matchId: "m-active",
      result: "BLACK_WIN",
      reason: "RESIGN",
      fen: activeMatch.fen,
      endedAt: "2026-04-19T06:10:00.000Z",
    }
    act(() => socketMock.handlers.get("match:ended")?.(ended))

    expect(result.current.ended).toEqual(ended)
    expect(result.current.emitMove({ from: "e2", to: "e4" })).toBe(false)
  })

  it("joins a shareable spectator match and keeps mutations disabled", async () => {
    useAuthStore.setState({
      accessToken: "token",
      user: {
        id: "u-spectator",
        email: "s@example.com",
        name: "Spectator",
        avatar: null,
        provider: "local",
      },
      isAuthenticated: true,
    })

    const { result, unmount } = renderHook(() => useRemoteMatch({ spectateMatchId: "m-active" }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(socketMock.io).toHaveBeenCalledWith("/match", expect.any(Object)))
    expect(socketMock.emit).toHaveBeenCalledWith("spectate:join", { matchId: "m-active" })

    const spectatorState: MatchStateEvent = {
      ...activeMatch,
      viewerRole: "spectator",
      viewerColor: undefined,
    }
    act(() => socketMock.handlers.get("state")?.(spectatorState))

    expect(result.current.matchState?.viewerRole).toBe("spectator")
    expect(result.current.color).toBeNull()
    expect(result.current.isSpectator).toBe(true)
    expect(result.current.emitMove({ from: "e2", to: "e4" })).toBe(false)
    expect(result.current.resign()).toBe(false)
    expect(socketMock.emit).not.toHaveBeenCalledWith("move", expect.any(Object))
    expect(socketMock.emit).not.toHaveBeenCalledWith("resign", expect.any(Object))

    unmount()
    expect(socketMock.emit).toHaveBeenCalledWith("spectate:left", { matchId: "m-active" })
  })
})
