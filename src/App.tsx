import { useEffect, useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"

import { ThemeProvider } from "./components/theme-provider"
import { initAuth } from "./features/auth/hooks/use-auth"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

const queryClient = new QueryClient()

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initAuth().finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
