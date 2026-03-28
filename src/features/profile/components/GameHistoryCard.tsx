import { useTranslation } from "react-i18next"

import { Swords } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { GameResult } from "@/features/profile/hooks/use-profile"
import { useGameHistory } from "@/features/profile/hooks/use-profile"

const resultColor: Record<GameResult, string> = {
  win: "text-green-600",
  loss: "text-red-600",
  draw: "text-muted-foreground",
}

export default function GameHistoryCard() {
  const { t, i18n } = useTranslation("profile")
  const { data: games, isLoading } = useGameHistory()

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("games.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("games.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!games || games.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Swords className="h-10 w-10" />
            <p className="text-sm">{t("games.empty")}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {games.map((game, index) => (
              <div key={game.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {game.opponent.name}{" "}
                      <span className="text-sm text-muted-foreground">
                        ({game.opponent.rating})
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {game.timeControl} &middot; {formatDate(game.playedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${resultColor[game.result]}`}>
                      {t(`games.${game.result}`)}
                    </p>
                    <p
                      className={`text-xs ${game.ratingChange >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {game.ratingChange > 0 ? "+" : ""}
                      {game.ratingChange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
