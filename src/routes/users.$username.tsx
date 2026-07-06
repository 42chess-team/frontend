import { createFileRoute } from "@tanstack/react-router"

import PublicProfilePage from "@/features/profile/pages/PublicProfilePage"

export const Route = createFileRoute("/users/$username")({
  component: UserPublicProfileRoute,
})

function UserPublicProfileRoute() {
  const { username } = Route.useParams()
  return <PublicProfilePage username={username} />
}
