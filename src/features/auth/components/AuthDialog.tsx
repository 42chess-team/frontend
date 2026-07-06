import { type FormEvent, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { VisuallyHidden } from "radix-ui"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/features/auth/hooks/use-auth"
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
  const { localLogin, signup } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await localLogin({ email, password })
      } else {
        await signup({ email, username, displayName: name, password })
      }
      onOpenChange(false)
    } catch {
      setError(t("form.error"))
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <Tabs value={mode} onValueChange={(value) => setMode(value as "login" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("form.loginTab")}</TabsTrigger>
                    <TabsTrigger value="signup">{t("form.signupTab")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value={mode}>
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                      {mode === "signup" && (
                        <>
                          <Field>
                            <FieldLabel htmlFor="auth-name">{t("form.name")}</FieldLabel>
                            <Input
                              id="auth-name"
                              name="name"
                              autoComplete="name"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="auth-username">{t("form.username")}</FieldLabel>
                            <Input
                              id="auth-username"
                              name="username"
                              autoComplete="username"
                              pattern="[a-z0-9_]{3,20}"
                              title={t("form.usernameHelp")}
                              value={username}
                              onChange={(event) => setUsername(event.target.value)}
                              required
                            />
                            <FieldDescription>{t("form.usernameHelp")}</FieldDescription>
                          </Field>
                        </>
                      )}
                      <Field>
                        <FieldLabel htmlFor="auth-email">{t("form.email")}</FieldLabel>
                        <Input
                          id="auth-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="auth-password">{t("form.password")}</FieldLabel>
                        <Input
                          id="auth-password"
                          name="password"
                          type="password"
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          minLength={8}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                        />
                      </Field>
                      <FieldError>{error}</FieldError>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t("form.submitting") : t(`form.${mode}`)}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                <div className="relative flex items-center justify-center">
                  <div className="h-px flex-1 bg-border" />
                  <span className="px-3 text-xs text-muted-foreground">
                    {tCommon("orContinueWith")}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
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
