import { useTranslation } from "react-i18next"

import { Link } from "@tanstack/react-router"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex min-h-12 max-w-7xl flex-col items-center justify-center gap-2 px-4 py-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">&copy; 2026 42Chess</p>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("terms.privacyPolicy")}
          </Link>
          <Link
            to="/terms"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("terms.termsOfService")}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
