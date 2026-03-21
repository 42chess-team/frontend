import { createFileRoute } from "@tanstack/react-router"

import LobbyPage from "@/features/lobby/pages"

export const Route = createFileRoute("/lobby")({
  component: LobbyPage,
})
