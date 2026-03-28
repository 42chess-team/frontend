import { createFileRoute } from "@tanstack/react-router"

import ProfilePage from "@/features/profile/pages"

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
})
