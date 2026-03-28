import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/features/auth/stores/auth-store"

export default function UserInfoCard({ isLoading = false }: { isLoading?: boolean }) {
  const [imgError, setImgError] = useState(false)
  const { t } = useTranslation("profile")
  const { user } = useAuthStore()

  if (isLoading || !user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {user.avatar && !imgError ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              {t("userInfo.signedInWith", { provider: user.provider })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
