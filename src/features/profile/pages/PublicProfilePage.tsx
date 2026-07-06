import { useTranslation } from "react-i18next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  usePublicGameHistory,
  usePublicProfile,
  usePublicProfileStats,
} from "@/features/profile/hooks/use-profile"

export default function PublicProfilePage({ username }: { username: string }) {
  const { t } = useTranslation("profile")
  const profileQuery = usePublicProfile(username)
  const statsQuery = usePublicProfileStats(username)
  const gamesQuery = usePublicGameHistory(username)

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-36 w-full" />
      </div>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("publicProfile.notFoundTitle")}</CardTitle>
            <CardDescription>{t("publicProfile.notFoundDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const profile = profileQuery.data
  const stats = statsQuery.data
  const totalGames = stats ? stats.wins + stats.losses + stats.draws : 0
  const winRate = totalGames > 0 && stats ? ((stats.wins / totalGames) * 100).toFixed(1) : "0.0"

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">{t("publicProfile.title")}</p>
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t("publicProfile.summary")}</CardTitle>
          <CardDescription>
            {t("publicProfile.memberSince", {
              date: new Date(profile.createdAt).toLocaleDateString(),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold">{stats?.rating ?? 1200}</p>
              <p className="text-sm text-muted-foreground">{t("stats.rating")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.wins ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("stats.wins")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats?.losses ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("stats.losses")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">{stats?.draws ?? 0}</p>
              <p className="text-sm text-muted-foreground">{t("stats.draws")}</p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("stats.winRate")}</span>
            <span className="font-medium">{winRate}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("games.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {gamesQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("social.loading")}</p>
          ) : (gamesQuery.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">{t("games.empty")}</p>
          ) : (
            <ul className="space-y-3">
              {gamesQuery.data?.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{game.opponent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {game.timeControl} · {new Date(game.playedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{t(`games.${game.result}`)}</p>
                    <p className="text-xs text-muted-foreground">
                      {game.ratingChange > 0 ? "+" : ""}
                      {game.ratingChange}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
