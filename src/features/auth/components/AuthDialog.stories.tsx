import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { AuthDialog } from "./AuthDialog"

const meta: Meta<typeof AuthDialog> = {
  title: "auth/AuthDialog",
  component: AuthDialog,
  args: {
    open: true,
    onOpenChange: fn(),
  },
}
export default meta

type Story = StoryObj<typeof AuthDialog>

export const Default: Story = {}
