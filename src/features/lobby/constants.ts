export type TimePreset = {
  base: number
  increment: number
}

export type TimeCategory = "bullet" | "blitz" | "rapid"

export const TIME_PRESETS: Record<TimeCategory, TimePreset[]> = {
  bullet: [
    { base: 1, increment: 0 },
    { base: 2, increment: 1 },
  ],
  blitz: [
    { base: 3, increment: 2 },
    { base: 5, increment: 3 },
  ],
  rapid: [
    { base: 15, increment: 10 },
  ],
}

export const TIME_CATEGORIES: TimeCategory[] = ["bullet", "blitz", "rapid"]

export function formatTime(preset: TimePreset): string {
  return `${preset.base}+${preset.increment}`
}

const AVG_MOVES = 40

export function estimateGameDuration(preset: TimePreset): string {
  const totalSeconds = (preset.base * 60 + AVG_MOVES * preset.increment) * 2
  const minutes = Math.round(totalSeconds / 60)
  return `~${minutes}min`
}
