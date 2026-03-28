import type { Meta, StoryObj } from "@storybook/react-vite"

import { FriendlyPanel } from "./FriendlyPanel"

const meta: Meta<typeof FriendlyPanel> = {
  component: FriendlyPanel,
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FriendlyPanel>

export const Default: Story = {}
