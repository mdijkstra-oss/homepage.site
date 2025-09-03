import type { Meta, StoryObj } from "@storybook/react";

import {ContentBox, ContentBoxProps, contentBoxVariants} from "./ContentBox";

const meta: Meta<ContentBoxProps> = {
    title: "Components/ContentBox",
    component: ContentBox,
    argTypes: {
        variant: {
            control: {
                type: "multi-select",
            },
            options: contentBoxVariants
        },
    }
}

export default meta;

type Story = StoryObj<ContentBoxProps>

export const Box: Story = {
    args: {
        variant: "primary",
        children: "A box the likes the world has never seen before"
    }
}