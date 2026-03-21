import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import type { TimePreset } from "../constants"
import { TimePresetGrid } from "./TimePresetGrid"

export function FriendlyPanel() {
  const { t } = useTranslation("lobby")
  const [selected, setSelected] = useState<TimePreset | null>(null)
  const [customBase, setCustomBase] = useState(10)
  const [customIncrement, setCustomIncrement] = useState(0)
  const [useCustom, setUseCustom] = useState(false)

  const handleSelectPreset = (preset: TimePreset) => {
    setSelected(preset)
    setUseCustom(false)
  }

  const handleUseCustom = () => {
    setUseCustom(true)
    setSelected(null)
  }

  const handleCreateRoom = () => {
    const time = useCustom ? { base: customBase, increment: customIncrement } : selected
    if (!time) return
    // TODO: Socket.IO 방 생성 + 초대 링크 생성
  }

  const isReady = useCustom || selected !== null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("mode.friendly")}</CardTitle>
        <CardDescription>{t("friendly.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimePresetGrid selected={selected} onSelect={handleSelectPreset} />

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{t("friendly.or")}</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-3">
          <Button
            variant={useCustom ? "default" : "outline"}
            className="w-full"
            onClick={handleUseCustom}
          >
            {t("friendly.customTime")}
          </Button>
          {useCustom && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("friendly.baseTime")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={180}
                  value={customBase}
                  onChange={(e) => setCustomBase(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("friendly.increment")}</Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={customIncrement}
                  onChange={(e) => setCustomIncrement(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <Button className="w-full" size="lg" disabled={!isReady} onClick={handleCreateRoom}>
          {t("friendly.createRoom")}
        </Button>
      </CardContent>
    </Card>
  )
}
