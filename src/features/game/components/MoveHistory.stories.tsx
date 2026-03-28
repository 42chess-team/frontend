import type { Meta, StoryObj } from "@storybook/react-vite"

import { MoveHistory } from "./MoveHistory"

const meta: Meta<typeof MoveHistory> = {
  component: MoveHistory,
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MoveHistory>

export const Default: Story = {
  args: {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"],
  },
}

export const Empty: Story = {
  args: {
    moves: [],
  },
}

export const OddMoves: Story = {
  args: {
    moves: ["e4", "e5", "Nf3"],
  },
}
