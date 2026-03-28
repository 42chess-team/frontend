import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

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

export const WithMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText("Type a message...")
    await userEvent.type(input, "Hello!")
    await userEvent.click(canvas.getByRole("button"))
    await expect(canvas.getByText("Hello!")).toBeInTheDocument()
  },
}
