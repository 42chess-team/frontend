import { useTranslation } from "react-i18next"

import { Clock, Flame, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  TIME_CATEGORIES,
  TIME_PRESETS,
  type TimeCategory,
  type TimePreset,
  estimateGameDuration,
  formatTime,
} from "../constants"

const categoryIcons: Record<TimeCategory, React.ReactNode> = {
  bullet: <Zap className="h-4 w-4" />,
  blitz: <Flame className="h-4 w-4" />,
  rapid: <Clock className="h-4 w-4" />,
}

export function TimePresetGrid({
  selected,
  onSelect,
  presets = TIME_PRESETS,
}: {
  selected: TimePreset | null
  onSelect: (preset: TimePreset) => void
  presets?: Record<TimeCategory, TimePreset[]>
}) {
  const { t } = useTranslation("lobby")

  const isSelected = (preset: TimePreset) =>
    selected?.base === preset.base && selected?.increment === preset.increment

  return (
    <div className="space-y-6">
      {TIME_CATEGORIES.map((category) => {
        const categoryPresets = presets[category]
        if (categoryPresets.length === 0) return null
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {categoryIcons[category]}
              {t(`category.${category}`)}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categoryPresets.map((preset) => (
                <Button
                  key={formatTime(preset)}
                  variant={isSelected(preset) ? "default" : "outline"}
                  className={`h-14 flex-col gap-0.5 ${categoryPresets.length === 1 ? "col-span-2" : ""}`}
                  onClick={() => onSelect(preset)}
                >
                  <span className="text-base font-semibold">{formatTime(preset)}</span>
                  <span className="text-xs font-normal opacity-60">
                    {estimateGameDuration(preset)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
