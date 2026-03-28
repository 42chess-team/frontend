import { useTranslation } from "react-i18next"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import GameHistoryCard from "@/features/profile/components/GameHistoryCard"
import StatsCard from "@/features/profile/components/StatsCard"
import UserInfoCard from "@/features/profile/components/UserInfoCard"

export default function ProfilePage() {
  const { t } = useTranslation("profile")
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <p className="text-center text-muted-foreground">{t("notLoggedIn")}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="space-y-6">
            <UserInfoCard />
            <StatsCard />
            <GameHistoryCard />
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.title")}</CardTitle>
              <CardDescription>{t("settings.comingSoon")}</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
