import type { Meta, StoryObj } from "@storybook/react-vite"

import { MatchmakingPanel } from "./MatchmakingPanel"

const meta: Meta<typeof MatchmakingPanel> = {
  component: MatchmakingPanel,
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MatchmakingPanel>

export const Casual: Story = {
  args: { mode: "casual" },
}

export const Ranked: Story = {
  args: { mode: "ranked" },
}
