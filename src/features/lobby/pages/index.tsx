import { useTranslation } from "react-i18next"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FriendlyPanel } from "../components/FriendlyPanel"
import { MatchmakingPanel } from "../components/MatchmakingPanel"

export default function LobbyPage() {
  const { t } = useTranslation("lobby")

  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Tabs defaultValue="casual">
        <TabsList className="w-full">
          <TabsTrigger value="casual" className="flex-1">
            {t("mode.casual")}
          </TabsTrigger>
          <TabsTrigger value="ranked" className="flex-1">
            {t("mode.ranked")}
          </TabsTrigger>
          <TabsTrigger value="friendly" className="flex-1">
            {t("mode.friendly")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="casual">
          <MatchmakingPanel mode="casual" />
        </TabsContent>
        <TabsContent value="ranked">
          <MatchmakingPanel mode="ranked" />
        </TabsContent>
        <TabsContent value="friendly">
          <FriendlyPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
