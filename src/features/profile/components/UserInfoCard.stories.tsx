import type { Meta, StoryObj } from "@storybook/react-vite"

import { useAuthStore } from "@/features/auth/stores/auth-store"

import UserInfoCard from "./UserInfoCard"

const meta: Meta<typeof UserInfoCard> = {
  component: UserInfoCard,
  decorators: [
    (Story) => {
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: "mock-token",
        user: {
          id: "1",
          email: "player@42chess.com",
          name: "Chess Player",
          avatar: null,
          provider: "google",
        },
      })
      return <Story />
    },
  ],
}
export default meta

type Story = StoryObj<typeof UserInfoCard>

export const Default: Story = {}

export const WithAvatar: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: "mock-token",
        user: {
          id: "1",
          email: "player@42chess.com",
          name: "Chess Player",
          avatar: "https://api.dicebear.com/9.x/pixel-art/svg?seed=chess",
          provider: "42",
        },
      })
      return <Story />
    },
  ],
}

export const BrokenAvatar: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: "mock-token",
        user: {
          id: "1",
          email: "player@42chess.com",
          name: "Chess Player",
          avatar: "https://invalid-url.example/broken.jpg",
          provider: "google",
        },
      })
      return <Story />
    },
  ],
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}
