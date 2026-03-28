import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfileStats } from "@/features/profile/hooks/use-profile"

export default function StatsCard() {
  const { t } = useTranslation("profile")
  const { data: stats, isLoading, isError } = useProfileStats()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t("stats.error")}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const totalGames = stats.wins + stats.losses + stats.draws
  const winRate = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(1) : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("stats.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold">{stats.rating}</p>
            <p className="text-sm text-muted-foreground">{t("stats.rating")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
            <p className="text-sm text-muted-foreground">{t("stats.wins")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
            <p className="text-sm text-muted-foreground">{t("stats.losses")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.draws}</p>
            <p className="text-sm text-muted-foreground">{t("stats.draws")}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("stats.totalGames")}</span>
          <span className="font-medium">{totalGames}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("stats.winRate")}</span>
          <span className="font-medium">{winRate}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
