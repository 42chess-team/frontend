import { useTranslation } from "react-i18next"

import { Flag, Handshake } from "lucide-react"

import { Button } from "@/components/ui/button"

export function GameControls({
  onResign,
  onOfferDraw,
  disabled = false,
}: {
  onResign: () => void
  onOfferDraw: () => void
  disabled?: boolean
}) {
  const { t } = useTranslation("game")

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={onOfferDraw}
        disabled={disabled}
      >
        <Handshake className="h-4 w-4" />
        {t("offerDraw")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="flex-1"
        onClick={onResign}
        disabled={disabled}
      >
        <Flag className="h-4 w-4" />
        {t("resign")}
      </Button>
    </div>
  )
}
