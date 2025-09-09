import { Navigation } from "@/layouts/PrimaryLayout/Navigation/Top";

import style from './layout.module.scss'

import {ExternalLink} from "@/layouts/PrimaryLayout/Navigation/Top/Navigation";
import {ContentBox} from "@/components/ContentBox/Box";
import {ActiveList} from "@/components/ActiveList";
import {ContentBoxFeed, ContentBoxFeedProps} from "@/components/ContentBox/Feed/Feed";
import {ContentBoxProps} from "@/components/ContentBox/Box/ContentBox";

export const defaultExternalLinks: ExternalLink[] = [
    { tag: "codeberg", url: "https://codeberg.org/mdijkstra" },
    { tag: "linkedin", url: "https://www.linkedin.com/in/matthijn-dijkstra-65527199/" },
    { tag: "resume", url: "https://mdijkstra.dev/resume" },
    { tag: "contact", url: "mailto:<hello@mdijkstra.dev>"}
]

const sampleListItems = [
    {path: "/introduction", label: "Introduction", active: true},
    {path: "/experience", label: "Experience", active: false},
    {path: "/recommendations", label: "Recommendations", active: false},
    {path: "/open-source", label: "Open Source", active: false},
    {path: "/patents", label: "Patents", active: false},
    {path: "/education", label: "Education", active: false},
]

const feed: ContentBoxProps[] = [
    {
        variant: 'secondary',
        children: 'How do you set up a Vite project locally without installing anything on your machine?',
    },
    {
        variant: 'primary',
        children: `It runs the Vite-based build setup directly in the browser, so it is almost identical to the local setup but doesn't require installing anything on your machine. 【1】\n\nThis allows for instant server start and hot module replacement without the initial overhead of local dependencies.`,
    },
    {
        variant: 'secondary',
        children: 'What is required to enable SCSS support in a Vite project?',
    },
    {
        variant: 'primary',
        children: `Install the \`sass\` package as a dev dependency:\n\n\`\`\`bash\nnpm add -D sass\n\`\`\`\n\nVite will then automatically process \`.scss\` files. No additional configuration is needed. 【1】`,
    },
    {
        variant: 'secondary',
        children: 'How does Vite achieve fast cold start times?',
    },
    {
        variant: 'primary',
        children: `Vite leverages native ES modules and serves code over HTTP with minimal processing. This eliminates the need for bundling during development.\n\nThe browser handles module resolution, enabling faster server start and instant updates. 【1】`,
    },
];


export const PrimaryLayout = () => {

    return (
        <div id={style.root}>
            <header>
                <Navigation externalLinks={defaultExternalLinks} />
            </header>
            <main className={style.container}>
                <nav>
                    <ContentBox variant="secondary">
                        <ActiveList items={sampleListItems} />
                    </ContentBox>
                </nav>

                <section>
                    <ContentBoxFeed feed={feed} />
                </section>
            </main>
            <footer>

            </footer>
        </div>
    );
}
