import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import type { TimePreset } from "../constants"
import { TimePresetGrid } from "./TimePresetGrid"

const meta: Meta<typeof TimePresetGrid> = {
  component: TimePresetGrid,
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof TimePresetGrid>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimePreset | null>(null)
    return <TimePresetGrid selected={selected} onSelect={setSelected} />
  },
}

export const WithSelection: Story = {
  args: {
    selected: { base: 5, increment: 3 },
    onSelect: () => {},
  },
}
