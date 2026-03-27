import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { User } from "lucide-react"

import type { Player } from "../types"

type IntroPhase = "enter" | "vs" | "exit" | "done"

export function VsIntro({
  white,
  black,
  onComplete,
}: {
  white: Player
  black: Player
  onComplete: () => void
}) {
  const { t } = useTranslation("game")
  const [phase, setPhase] = useState<IntroPhase>("enter")

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("vs"), 600),
      setTimeout(() => setPhase("exit"), 2000),
      setTimeout(() => {
        setPhase("done")
        onComplete()
      }, 2600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 상대 (흑) - 위에서 슬라이드 */}
      <div
        className={`flex flex-col items-center gap-2 transition-all duration-500 ${
          phase === "enter" ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <PlayerIntroCard player={black} />
      </div>

      {/* VS */}
      <div
        className={`my-8 transition-all duration-300 delay-300 ${
          phase === "enter" ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <span className="text-4xl font-black tracking-widest text-primary">{t("vs")}</span>
      </div>

      {/* 나 (백) - 아래에서 슬라이드 */}
      <div
        className={`flex flex-col items-center gap-2 transition-all duration-500 ${
          phase === "enter" ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <PlayerIntroCard player={white} />
      </div>
    </div>
  )
}

function PlayerIntroCard({ player }: { player: Player }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {player.avatar ? (
          <img
            src={player.avatar}
            alt={player.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <User className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <p className="text-lg font-bold">{player.name}</p>
      <p className="text-sm text-muted-foreground">{player.rating}</p>
    </div>
  )
}
