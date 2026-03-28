import type { Meta, StoryObj } from "@storybook/react-vite"

import { AuthDialog } from "./AuthDialog"

const meta: Meta<typeof AuthDialog> = {
  component: AuthDialog,
  args: {
    open: true,
    onOpenChange: () => {},
  },
}
export default meta

type Story = StoryObj<typeof AuthDialog>

export const Default: Story = {}
