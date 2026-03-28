import { action } from "@storybook/addon-actions"
import type { Meta, StoryObj } from "@storybook/react-vite"

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
    onResign: action("onResign"),
    onOfferDraw: action("onOfferDraw"),
  },
}
