import { Navigation } from "@/layouts/PrimaryLayout/Navigation/Top";

import style from './layout.module.scss'

import {ExternalLink} from "@/layouts/PrimaryLayout/Navigation/Top/Navigation";

export const defaultExternalLinks: ExternalLink[] = [
    { tag: "codeberg", url: "https://codeberg.org/mdijkstra" },
    { tag: "linkedin", url: "https://www.linkedin.com/in/matthijn-dijkstra-65527199/" },
    { tag: "resume", url: "https://mdijkstra.dev/resume" },
    { tag: "contact", url: "mailto:<hello@mdijkstra.dev>"}
]

export const PrimaryLayout = () => {

    return (
        <div id={style.root}>
            <header>
                <Navigation externalLinks={defaultExternalLinks} />
            </header>
            <main className={style.outerContainer}>
                <nav>
                    Some list
                </nav>

                <section>
                    Content
                </section>
            </main>
            <footer>

            </footer>
        </div>
    );
}
