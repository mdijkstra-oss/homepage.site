import type { Meta, StoryObj } from '@storybook/react'

import { CaretInput, CaretInputProps } from './CaretInput'

const meta: Meta<CaretInputProps> = {
  title: 'Components/CaretInput',
  component: CaretInput,
}

export default meta

type Story = StoryObj<CaretInputProps>

export const Default: Story = {
  args: {
    placeholder: 'Where do you want to go today?',
  },
}
