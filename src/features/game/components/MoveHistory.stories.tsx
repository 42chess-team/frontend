import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("e4")).toBeInTheDocument()
    await expect(canvas.getByText("Nf6")).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: {
    moves: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.queryAllByText(/\d+\./)
    await expect(items).toHaveLength(0)
  },
}

export const OddMoves: Story = {
  args: {
    moves: ["e4", "e5", "Nf3"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Nf3")).toBeInTheDocument()
  },
}
