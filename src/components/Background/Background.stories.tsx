import type { Meta, StoryObj } from "@storybook/react";

import {Background, BackgroundProps} from "./Background";

const meta: Meta<BackgroundProps> = {
    title: "Components/Background",
    component: Background,
    argTypes: {

    }
}

export default meta;

type Story = StoryObj<BackgroundProps>

export const Sample: Story = {
    args: {
        seed: 123121337,
        speed: 100
    }
}