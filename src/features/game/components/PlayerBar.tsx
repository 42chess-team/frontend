import { User } from "lucide-react"

import type { Player } from "../types"

export function PlayerBar({
  player,
  timeLeft,
  isActive,
}: {
  player: Player
  timeLeft: number
  isActive: boolean
}) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 ${
        isActive ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={player.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-semibold">{player.name}</p>
          <p className="text-xs text-muted-foreground">{player.rating}</p>
        </div>
      </div>
      <div
        className={`rounded-md px-3 py-1.5 font-mono text-lg font-bold ${
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  )
}
