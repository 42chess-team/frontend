import type { Meta, StoryObj } from "@storybook/react-vite"

import { OAuthButtons } from "./OAuthButtons"

const meta: Meta<typeof OAuthButtons> = {
  title: "auth/OAuthButtons",
  component: OAuthButtons,
}
export default meta

type Story = StoryObj<typeof OAuthButtons>

export const Default: Story = {}
