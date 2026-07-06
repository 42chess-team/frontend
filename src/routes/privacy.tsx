import { useTranslation } from "react-i18next"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
})

function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{t("legal.updated")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("privacy.title")}</h1>
        <p className="text-muted-foreground">{t("privacy.intro")}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy.sections.account.title")}</h2>
        <p className="text-muted-foreground">{t("privacy.sections.account.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy.sections.gameplay.title")}</h2>
        <p className="text-muted-foreground">{t("privacy.sections.gameplay.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy.sections.security.title")}</h2>
        <p className="text-muted-foreground">{t("privacy.sections.security.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy.sections.retention.title")}</h2>
        <p className="text-muted-foreground">{t("privacy.sections.retention.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy.sections.contact.title")}</h2>
        <p className="text-muted-foreground">{t("privacy.sections.contact.body")}</p>
      </section>
    </main>
  )
}
