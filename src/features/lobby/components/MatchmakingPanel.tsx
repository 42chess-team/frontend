import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { TimePreset } from "../constants"
import { TimePresetGrid } from "./TimePresetGrid"

export function MatchmakingPanel({ mode }: { mode: "casual" | "ranked" }) {
  const { t } = useTranslation("lobby")
  const [selected, setSelected] = useState<TimePreset | null>(null)
  const [searching, setSearching] = useState(false)

  const handleFindMatch = () => {
    if (!selected) return
    setSearching(true)
    // TODO: Socket.IO 매칭 큐 진입
  }

  const handleCancel = () => {
    setSearching(false)
    // TODO: Socket.IO 매칭 큐 취소
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(`mode.${mode}`)}</CardTitle>
        <CardDescription>{t(`${mode}.description`)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimePresetGrid selected={selected} onSelect={setSelected} />
        {searching ? (
          <Button className="w-full" variant="outline" size="lg" onClick={handleCancel}>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("searching")}
          </Button>
        ) : (
          <Button className="w-full" size="lg" disabled={!selected} onClick={handleFindMatch}>
            {t("findMatch")}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
