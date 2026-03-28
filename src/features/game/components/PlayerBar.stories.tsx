import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "@storybook/test"

import { PlayerBar } from "./PlayerBar"

const meta: Meta<typeof PlayerBar> = {
  component: PlayerBar,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof PlayerBar>

export const Active: Story = {
  args: {
    player: { id: "1", name: "Chess Player", rating: 1200, avatar: null },
    timeLeft: 245,
    isActive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Chess Player")).toBeInTheDocument()
    await expect(canvas.getByText("4:05")).toBeInTheDocument()
  },
}

export const Inactive: Story = {
  args: {
    player: { id: "2", name: "Opponent", rating: 1350, avatar: null },
    timeLeft: 300,
    isActive: false,
  },
}

export const LowTime: Story = {
  args: {
    player: { id: "1", name: "Chess Player", rating: 1200, avatar: null },
    timeLeft: 15,
    isActive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("0:15")).toBeInTheDocument()
  },
}

export const WithAvatar: Story = {
  args: {
    player: {
      id: "1",
      name: "Chess Player",
      rating: 1200,
      avatar: "https://api.dicebear.com/9.x/pixel-art/svg?seed=chess",
    },
    timeLeft: 180,
    isActive: true,
  },
}
