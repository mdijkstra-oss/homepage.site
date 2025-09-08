import type { Meta, StoryObj } from "@storybook/react";

import { CaretInput, PromptProps } from "./CaretInput";

const meta: Meta<PromptProps> = {
    title: "Components/CaretInput",
    component: CaretInput,
};

export default meta;

type Story = StoryObj<PromptProps>;

export const Default: Story = {
    args: {
        placeholder: "Where do you want to go today?",
    }
};
