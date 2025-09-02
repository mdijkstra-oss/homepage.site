import type { Meta, StoryObj } from "@storybook/react";

import { TagList, TagListProps } from "./List";

import { availableIcons } from "@/components/Icon/Icon";

const meta: Meta<TagListProps> = {
    title: "Components/Tag",
    component: TagList,
    argTypes: {
        tags: {
            control: {
                type: "multi-select",
            },
            options: availableIcons
        },
    }
}

export default meta;

type Story = StoryObj<TagListProps>

export const List: Story = {
    args: {
        tags: ["node", "php", "react"],
    }
}