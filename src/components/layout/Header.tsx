import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Link } from "@tanstack/react-router"
import { Globe, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthDialog } from "@/features/auth/components/AuthDialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { useTheme } from "@/hooks/use-theme"

export default function Header() {
  const { t, i18n } = useTranslation()
  const { setTheme } = useTheme()
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold">
              42Chess
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                to="/lobby"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {t("nav.lobby")}
              </Link>
              <Link
                to="/game"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {t("nav.game")}
              </Link>
              <Link
                to="/profile"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {t("nav.profile")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage("ko")}>
                  한국어
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                {t("nav.login")}
              </Button>
            )}
          </div>
        </div>
      </header>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
