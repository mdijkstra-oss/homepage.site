import type { Meta, StoryObj } from '@storybook/react'
import { Icon, IconProps, availableIcons } from './Icon'

const meta: Meta<IconProps> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: { type: 'select' },
      options: availableIcons,
    },
    tint: {
      control: { type: 'color' },
    },
  },
}

export default meta

type Story = StoryObj<IconProps>

export const Sample: Story = {
  args: {
    name: 'node',
  },
}
