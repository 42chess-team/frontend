import type { Meta, StoryObj } from "@storybook/react-vite"
import { HttpResponse, delay, http } from "msw"

import { withQueryClient } from "../../../../.storybook/decorators"
import StatsCard from "./StatsCard"

const meta: Meta<typeof StatsCard> = {
  component: StatsCard,
  decorators: [withQueryClient],
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

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/stats", () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
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
