import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import "./index.css"
import "./lib/i18n"

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === "true") {
    const { worker } = await import("./mocks/browser")
    return worker.start({ onUnhandledRequest: "bypass" })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
