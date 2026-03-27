import { createFileRoute } from "@tanstack/react-router"

import GamePage from "@/features/game/pages"

export const Route = createFileRoute("/game")({
  component: GamePage,
})
