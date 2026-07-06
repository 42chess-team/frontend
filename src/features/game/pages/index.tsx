import { useMemo } from "react"

import { Link } from "@tanstack/react-router"
import { Chess } from "chess.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/features/auth/stores/auth-store"

import { ChessBoard } from "../components/ChessBoard"
import { GameChat } from "../components/GameChat"
import { GameControls } from "../components/GameControls"
import { MoveHistory } from "../components/MoveHistory"
import { PlayerBar } from "../components/PlayerBar"
import { useRemoteMatch } from "../hooks/use-remote-match"
import type { Player } from "../types"

function msToSeconds(ms: number): number {
  return Math.max(0, Math.ceil(ms / 1000))
}

function playerFromUserId(
  userId: string,
  color: "white" | "black",
  selfUserId: string | null,
): Player {
  return {
    id: userId,
    name:
      userId === selfUserId
        ? `You (${color})`
        : `${color[0].toUpperCase()}${color.slice(1)} player`,
    rating: userId.slice(0, 8),
    avatar: null,
  }
}

function pgnToMoves(pgn?: string): string[] {
  if (!pgn) return []
  return pgn
    .replace(/\{[^}]*\}/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !/^\d+\.{1,3}$/.test(token))
    .filter((token) => !["1-0", "0-1", "1/2-1/2", "*"].includes(token))
}

export default function GamePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const spectateMatchId =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("spectate")
  const {
    activeQuery,
    matchState,
    ended,
    socketError,
    color,
    isSpectator,
    isLoading,
    emitMove,
    resign,
  } = useRemoteMatch({ spectateMatchId })

  const game = useMemo(() => {
    try {
      return new Chess(matchState?.fen)
    } catch {
      return new Chess()
    }
  }, [matchState?.fen])

  const players = useMemo(() => {
    const userId = activeQuery.data?.match
      ? color === "white"
        ? activeQuery.data.match.whiteUserId
        : color === "black"
          ? activeQuery.data.match.blackUserId
          : null
      : null
    if (!matchState) return null
    return {
      white: playerFromUserId(matchState.whiteUserId, "white", userId),
      black: playerFromUserId(matchState.blackUserId, "black", userId),
    }
  }, [activeQuery.data, color, matchState])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading active match…
          </CardContent>
        </Card>
      </div>
    )
  }

  if (spectateMatchId && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Login required to spectate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Spectator sockets are authenticated. Log in, then reopen this spectator link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (spectateMatchId && !matchState && !socketError) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Joining spectator match…</CardTitle>
          </CardHeader>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Waiting for live state for match {spectateMatchId}.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!matchState || !players) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>No active match</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {socketError
                ? `Unable to load match: ${socketError}`
                : "Start a friendly challenge from the lobby to play a server-authoritative remote game."}
            </p>
            <Button asChild>
              <Link to="/lobby">Go to lobby</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canMove = !ended && !isSpectator && color === matchState.turn
  const moves = pgnToMoves(matchState.pgn)
  const spectatorUrl = `/game?spectate=${encodeURIComponent(matchState.matchId)}`

  return (
    <div className="relative mx-auto max-w-6xl py-4 px-4">
      <div className="mb-3 rounded-lg border bg-card p-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-semibold">Match {matchState.matchId}</span>
            <span className="ml-2 text-muted-foreground">
              Turn: {matchState.turn} · You: {color ?? "unknown"}
            </span>
          </div>
          <div className="text-muted-foreground">
            {matchState.initialTimeSeconds / 60}+{matchState.incrementSeconds}s
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {isSpectator
            ? "Spectator mode: board controls and resign are read-only."
            : `Spectator link: ${spectatorUrl}`}
        </p>
        {socketError && <p className="mt-2 text-destructive">Socket: {socketError}</p>}
        {ended && (
          <p className="mt-2 font-medium">
            Match ended: {ended.result} by {ended.reason}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex w-60 shrink-0 flex-col gap-3">
          <MoveHistory moves={moves} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <PlayerBar
            player={players.black}
            timeLeft={msToSeconds(matchState.blackClockMs)}
            isActive={!ended && matchState.turn === "black"}
          />
          <ChessBoard
            game={game}
            position={matchState.fen}
            orientation={color === "black" ? "black" : "white"}
            canMove={canMove}
            onMove={(from, to, promotion) => emitMove({ from, to, promotion })}
          />
          <PlayerBar
            player={players.white}
            timeLeft={msToSeconds(matchState.whiteClockMs)}
            isActive={!ended && matchState.turn === "white"}
          />
        </div>
        <div className="flex w-60 shrink-0 flex-col gap-3">
          <GameChat />
          <GameControls
            onResign={resign}
            onOfferDraw={() => undefined}
            disabled={Boolean(ended) || isSpectator}
          />
        </div>
      </div>
    </div>
  )
}
