import { useTranslation } from "react-i18next"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/terms")({
  component: TermsPage,
})

function TermsPage() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{t("legal.updated")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("termsPage.title")}</h1>
        <p className="text-muted-foreground">{t("termsPage.intro")}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("termsPage.sections.accounts.title")}</h2>
        <p className="text-muted-foreground">{t("termsPage.sections.accounts.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("termsPage.sections.fairPlay.title")}</h2>
        <p className="text-muted-foreground">{t("termsPage.sections.fairPlay.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("termsPage.sections.content.title")}</h2>
        <p className="text-muted-foreground">{t("termsPage.sections.content.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("termsPage.sections.availability.title")}</h2>
        <p className="text-muted-foreground">{t("termsPage.sections.availability.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("termsPage.sections.contact.title")}</h2>
        <p className="text-muted-foreground">{t("termsPage.sections.contact.body")}</p>
      </section>
    </main>
  )
}
