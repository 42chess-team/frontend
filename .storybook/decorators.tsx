import type { Decorator } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const withQueryClient: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  )
}
