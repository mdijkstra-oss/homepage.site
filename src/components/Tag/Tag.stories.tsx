import type { Meta, StoryObj } from "@storybook/react";

import { Tag, TagProps } from "./Tag";
import { availableIcons } from "@/components/Icon/Icon";
import { fn } from 'storybook/test';

const meta: Meta<TagProps> = {
    title: "Components/Tag",
    component: Tag,
    args: { onPress: fn() },
    argTypes: {
        name: {
            control: {
                type: "select",
                options: availableIcons
            }
        }
    }
}

export default meta;

type Story = StoryObj<TagProps>

export const Sample: Story = {
    args: {
        name: "node",
    }
}