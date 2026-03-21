import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold">
            OnChess
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/lobby"
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              Lobby
            </Link>
            <Link
              to="/game"
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              Game
            </Link>
            <Link
              to="/profile"
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <span className="text-sm text-muted-foreground hover:text-foreground">Login</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
