import type { Meta, StoryObj } from '@storybook/react'
import { Navigation, NavigationProps } from './Navigation'
import { defaultExternalLinks } from '@/layouts/PrimaryLayout/PrimaryLayout'

const meta: Meta<NavigationProps> = {
  title: 'Layouts/PrimaryLayout/Navigation',
  component: Navigation,
}

export default meta

type Story = StoryObj<NavigationProps>

export const Top: Story = {
  args: {
    externalLinks: defaultExternalLinks,
  },
}
