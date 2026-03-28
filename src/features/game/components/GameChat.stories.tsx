import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameChat } from "./GameChat"

const meta: Meta<typeof GameChat> = {
  component: GameChat,
  decorators: [
    (Story) => (
      <div className="h-96 max-w-xs">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GameChat>

export const Default: Story = {}
