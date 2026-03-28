import type { Meta, StoryObj } from "@storybook/react-vite"
import { HttpResponse, delay, http } from "msw"

import { withQueryClient } from "../../../../.storybook/decorators"
import GameHistoryCard from "./GameHistoryCard"

const meta: Meta<typeof GameHistoryCard> = {
  component: GameHistoryCard,
  decorators: [withQueryClient],
}
export default meta

type Story = StoryObj<typeof GameHistoryCard>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/games", () =>
          HttpResponse.json([
            {
              id: "g1",
              opponent: { name: "Magnus_42", rating: 1320 },
              result: "win",
              ratingChange: 15,
              timeControl: "5+0",
              playedAt: "2026-03-27T18:30:00Z",
            },
            {
              id: "g2",
              opponent: { name: "BobbyFischer99", rating: 1180 },
              result: "loss",
              ratingChange: -12,
              timeControl: "10+5",
              playedAt: "2026-03-26T14:00:00Z",
            },
            {
              id: "g3",
              opponent: { name: "QueenGambit", rating: 1290 },
              result: "draw",
              ratingChange: 2,
              timeControl: "5+3",
              playedAt: "2026-03-24T11:00:00Z",
            },
          ]),
        ),
      ],
    },
  },
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.get("*/api/profile/games", () => HttpResponse.json([]))],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/profile/games", async () => {
          await delay("infinite")
        }),
      ],
    },
  },
}
