import type { Meta, StoryObj } from '@storybook/react'
import { PromptFeed, PromptFeedProps } from './PromptFeed'
import { samplePrompt } from '@/components/PromptFeed/sample'

const meta: Meta<PromptFeedProps> = {
  title: 'Components/PromptFeed',
  component: PromptFeed,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<PromptFeedProps>

export const Default: Story = {
  args: {
    prompt: samplePrompt,
  },
}
