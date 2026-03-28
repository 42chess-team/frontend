import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { GameControls } from "./GameControls"

const meta: Meta<typeof GameControls> = {
  component: GameControls,
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GameControls>

export const Default: Story = {
  args: {
    onResign: fn(),
    onOfferDraw: fn(),
  },
}
