import type { Meta, StoryObj } from "@storybook/react";
import {ContentBoxFeed, ContentBoxFeedProps} from "@/components/ContentBox/Feed/Feed";

const meta: Meta<ContentBoxFeedProps> = {
    title: "Components/ContentBox",
    component: ContentBoxFeed,
}

export default meta;

type Story = StoryObj<ContentBoxFeedProps>

export const Feed: Story = {
    args: {
        feed: [
            {
                variant: "secondary",
                children: "Lorem ipsum dolor sit amet."
            },
            {
                variant: "primary",
                children: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor."
            },
            {
                variant: "secondary",
                children: "Vestibulum ante ipsum primis. emo enim ipsam voluptatem?"
            },
            {
                variant: "primary",
                children: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
            },
            {
                variant: "secondary",
                children: "Nulla facilisi."
            },
            {
                variant: "primary",
                children: "Sed ut perspiciatis."
            },
        ]
    }
}