import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useNavigate } from "@tanstack/react-router"

import { useMatchControllerStart } from "@/api/matches/matches"
import { StartMatchDtoTimeControl } from "@/api/model"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import type { TimePreset } from "../constants"
import { TimePresetGrid } from "./TimePresetGrid"

function classifyTimeControl(baseMinutes: number) {
  if (baseMinutes < 3) return StartMatchDtoTimeControl.BULLET
  if (baseMinutes < 10) return StartMatchDtoTimeControl.BLITZ
  if (baseMinutes < 30) return StartMatchDtoTimeControl.RAPID
  return StartMatchDtoTimeControl.CLASSICAL
}

export function FriendlyPanel() {
  const { t } = useTranslation("lobby")
  const navigate = useNavigate()
  const [selected, setSelected] = useState<TimePreset | null>(null)
  const [customBase, setCustomBase] = useState(10)
  const [customIncrement, setCustomIncrement] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [opponentUsername, setOpponentUsername] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const startMatch = useMatchControllerStart({
    mutation: {
      onSuccess: () => void navigate({ to: "/game" }),
      onError: (error) => {
        setErrorMessage(error.response?.data?.message ?? "Could not start match")
      },
    },
  })

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
    const opponent = opponentUsername.trim()
    if (!time || !opponent) return
    setErrorMessage(null)
    startMatch.mutate({
      data: {
        opponentUsername: opponent,
        timeControl: classifyTimeControl(time.base),
        initialTimeSeconds: time.base * 60,
        incrementSeconds: time.increment,
      },
    })
  }

  const isReady = (useCustom || selected !== null) && opponentUsername.trim().length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("mode.friendly")}</CardTitle>
        <CardDescription>{t("friendly.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="friendly-opponent">Opponent username</Label>
          <Input
            id="friendly-opponent"
            value={opponentUsername}
            onChange={(e) => setOpponentUsername(e.target.value)}
            placeholder="friend_username"
            autoComplete="off"
          />
        </div>

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

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        <Button
          className="w-full"
          size="lg"
          disabled={!isReady || startMatch.isPending}
          onClick={handleCreateRoom}
        >
          {startMatch.isPending ? "Starting…" : t("friendly.createRoom")}
        </Button>
      </CardContent>
    </Card>
  )
}
