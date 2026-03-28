import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HttpResponse, delay, http } from "msw"

import StatsCard from "./StatsCard"

const meta: Meta<typeof StatsCard> = {
  component: StatsCard,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
}
export default meta

type Story = StoryObj<typeof StatsCard>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/stats", () =>
          HttpResponse.json({
            rating: 1247,
            wins: 42,
            losses: 31,
            draws: 12,
          }),
        ),
      ],
    },
  },
}

export const Beginner: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/stats", () =>
          HttpResponse.json({
            rating: 800,
            wins: 2,
            losses: 8,
            draws: 0,
          }),
        ),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/stats", async () => {
          await delay("infinite")
        }),
      ],
    },
  },
}
