import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { type Socket, io } from "socket.io-client"

import {
  getMatchControllerGetActiveQueryKey,
  useMatchControllerGetActive,
} from "@/api/matches/matches"
import type { ActiveMatchDto } from "@/api/model"
import { useAuthStore } from "@/features/auth/stores/auth-store"

export type MatchColor = "white" | "black"

export type MatchStateEvent = ActiveMatchDto & {
  pgn?: string
  viewerRole?: "player" | "spectator"
  viewerColor?: MatchColor
}

export type MatchMoveMadeEvent = {
  matchId: string
  san: string
  from: string
  to: string
  promotion: string | null
  fen: string
  turn: MatchColor
  whiteClockMs: number
  blackClockMs: number
}

export type MatchEndedEvent = {
  matchId: string
  result: string
  reason: string
  fen: string
  endedAt: string
}

export type RemoteMoveInput = {
  from: string
  to: string
  promotion?: string
}

function toStateFromMove(previous: MatchStateEvent, move: MatchMoveMadeEvent): MatchStateEvent {
  return {
    ...previous,
    fen: move.fen,
    turn: move.turn,
    whiteClockMs: move.whiteClockMs,
    blackClockMs: move.blackClockMs,
    pgn: previous.pgn ? `${previous.pgn} ${move.san}` : move.san,
  }
}

export function useRemoteMatch({
  spectateMatchId = null,
}: { spectateMatchId?: string | null } = {}) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = useAuthStore((state) => state.user?.id ?? null)
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const activeQuery = useMatchControllerGetActive({
    query: {
      enabled: !spectateMatchId,
      retry: false,
      refetchOnWindowFocus: true,
    },
  })
  const [liveState, setLiveState] = useState<MatchStateEvent | null>(null)
  const [ended, setEnded] = useState<MatchEndedEvent | null>(null)
  const [socketError, setSocketError] = useState<string | null>(null)

  const activeMatch = activeQuery.data?.match ?? null
  const activeMatchId = activeMatch?.matchId ?? spectateMatchId ?? null
  const matchState = useMemo<MatchStateEvent | null>(() => {
    if (liveState?.matchId === activeMatchId) return liveState
    return activeMatch ? { ...activeMatch } : null
  }, [activeMatch, activeMatchId, liveState])
  const activeEnded = ended?.matchId === matchState?.matchId ? ended : null

  useEffect(() => {
    if (!accessToken || !activeMatchId) {
      socketRef.current = null
      return
    }

    const nextSocket = io("/match", {
      auth: { token: accessToken },
      withCredentials: true,
      transports: ["websocket", "polling"],
    })
    socketRef.current = nextSocket

    const applyState = (state: MatchStateEvent) => {
      if (state.matchId !== activeMatchId) return
      setLiveState(state)
      setEnded(null)
      setSocketError(null)
    }

    const applyMove = (move: MatchMoveMadeEvent) => {
      if (move.matchId !== activeMatchId) return
      setLiveState((current) =>
        current?.matchId === move.matchId
          ? toStateFromMove(current, move)
          : activeMatch
            ? toStateFromMove(activeMatch, move)
            : current,
      )
    }

    const applyEnd = (event: MatchEndedEvent) => {
      if (event.matchId !== activeMatchId) return
      setEnded(event)
      setLiveState((current) =>
        current?.matchId === event.matchId
          ? { ...current, fen: event.fen }
          : activeMatch
            ? { ...activeMatch, fen: event.fen }
            : current,
      )
      void queryClient.invalidateQueries({ queryKey: getMatchControllerGetActiveQueryKey() })
    }

    const applyError = (error: unknown) => {
      if (error instanceof Error) {
        setSocketError(error.message)
        return
      }
      if (typeof error === "object" && error && "code" in error) {
        setSocketError(String((error as { code: unknown }).code))
        return
      }
      setSocketError(String(error))
    }

    nextSocket.on("state", applyState)
    nextSocket.on("move:made", applyMove)
    nextSocket.on("match:ended", applyEnd)
    nextSocket.on("error", applyError)
    nextSocket.on("spectate:error", applyError)
    nextSocket.on("connect_error", applyError)

    if (spectateMatchId) {
      nextSocket.emit("spectate:join", { matchId: spectateMatchId })
    }

    return () => {
      if (spectateMatchId) {
        nextSocket.emit("spectate:left", { matchId: spectateMatchId })
      }
      nextSocket.off("state", applyState)
      nextSocket.off("move:made", applyMove)
      nextSocket.off("match:ended", applyEnd)
      nextSocket.off("error", applyError)
      nextSocket.off("spectate:error", applyError)
      nextSocket.off("connect_error", applyError)
      nextSocket.disconnect()
      if (socketRef.current === nextSocket) socketRef.current = null
    }
  }, [accessToken, activeMatchId, activeMatch, queryClient, spectateMatchId])

  const color = useMemo<MatchColor | null>(() => {
    if (!matchState || !userId) return null
    if (matchState.whiteUserId === userId) return "white"
    if (matchState.blackUserId === userId) return "black"
    return null
  }, [matchState, userId])

  const emitMove = useCallback(
    ({ from, to, promotion = "q" }: RemoteMoveInput) => {
      if (!socketRef.current || !matchState || activeEnded || !color) return false
      socketRef.current.emit("move", { matchId: matchState.matchId, from, to, promotion })
      return true
    },
    [matchState, activeEnded, color],
  )

  const resign = useCallback(() => {
    if (!socketRef.current || !matchState || activeEnded || !color) return false
    socketRef.current.emit("resign", { matchId: matchState.matchId })
    return true
  }, [matchState, activeEnded, color])

  return {
    activeQuery,
    matchState,
    ended: activeEnded,
    socketError,
    color,
    isSpectator: matchState?.viewerRole === "spectator" || (Boolean(matchState) && !color),
    isLoading: activeQuery.isLoading,
    hasActiveMatch: Boolean(activeMatchId || matchState),
    emitMove,
    resign,
  }
}
