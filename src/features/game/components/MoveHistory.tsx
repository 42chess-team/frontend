import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MoveHistory({ moves }: { moves: string[] }) {
  const { t } = useTranslation("game")

  const movePairs: [string, string?][] = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1]])
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("moves")}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        {movePairs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noMoves")}</p>
        ) : (
          <div className="space-y-1">
            {movePairs.map(([white, black], i) => (
              <div key={i} className="grid grid-cols-[2rem_1fr_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span className="font-mono">{white}</span>
                <span className="font-mono">{black ?? ""}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
