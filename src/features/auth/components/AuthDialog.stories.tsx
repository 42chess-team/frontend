import { action } from "@storybook/addon-actions"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { AuthDialog } from "./AuthDialog"

const meta: Meta<typeof AuthDialog> = {
  title: "auth/AuthDialog",
  component: AuthDialog,
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
  },
}
export default meta

type Story = StoryObj<typeof AuthDialog>

export const Default: Story = {}
