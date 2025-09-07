import type { Meta, StoryObj } from "@storybook/react";

import { ActiveList, ActiveListProps } from "./ActiveList";

const meta: Meta<ActiveListProps> = {
  title: "Components/ActiveList",
  component: ActiveList,
};

export default meta;

type Story = StoryObj<ActiveListProps>;

export const Default: Story = {
  args: {
    items: [
      { path: "/home", label: "Home", active: false },
      { path: "/about", label: "About", active: true },
      { path: "/contact", label: "Contact", active: false },
      { path: "/blog", label: "Blog", active: false },
    ],
  }
};
