import { Trans, useTranslation } from "react-i18next"

import { VisuallyHidden } from "radix-ui"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { FieldDescription } from "@/components/ui/field"
import { ROUTES } from "@/lib/constants"

import { OAuthButtons } from "./OAuthButtons"

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation("auth")
  const { t: tCommon } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
        <VisuallyHidden.Root>
          <DialogTitle>{t("title")}</DialogTitle>
        </VisuallyHidden.Root>
        <Card className="border-0 shadow-none p-0">
          <CardContent className="grid min-h-100 p-0 md:grid-cols-2">
            <div className="flex flex-col justify-between p-6">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <OAuthButtons onSuccess={() => onOpenChange(false)} />
              </CardContent>
              <FieldDescription className="text-center text-xs">
                <Trans
                  t={tCommon}
                  i18nKey="terms.agree"
                  components={{
                    termsLink: (
                      <a
                        href={ROUTES.TERMS_OF_SERVICE}
                        className="underline underline-offset-2 hover:text-foreground"
                      />
                    ),
                    privacyLink: (
                      <a
                        href={ROUTES.PRIVACY_POLICY}
                        className="underline underline-offset-2 hover:text-foreground"
                      />
                    ),
                  }}
                />
              </FieldDescription>
            </div>

            <div className="relative hidden bg-muted md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
