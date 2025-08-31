import {FunctionalComponent, JSX} from 'preact';

import logo from '../../../assets/logo.png'
import linkedin from '../../../assets/linkedin.svg'
import { SiCodeberg } from "@icons-pack/react-simple-icons";
import style from './style.module.css'
import { classnames } from '@/utils/css';
import layoutStyle from './../layout.module.css'

export const Navigation: FunctionalComponent = () => {
    // @ts-ignore
    const codeberg = <SiCodeberg color="#ffffff" size={24} />

    return (
        <nav className={classnames(layoutStyle.container, style.nav)}>
            <a class={classnames(style.logo, layoutStyle.tinted)} href="/"><img src={logo} alt="mdijkstra.dev logo" title="Home" /></a>

            <ul>
                <li>

                    <External href="https://codeberg.org/mdijkstra" image={codeberg} text="Codeberg" />
                </li>
                <li>
                    <External href="https://www.linkedin.com/in/matthijn-dijkstra-65527199/" image={linkedin} text="Linkedin" />
                </li>
            </ul>
        </nav>
    );
};

const External: FunctionalComponent<{
    href: string;
    image: string | any;
    text: string;
}> = ({ href, image, text }) => {
    return (
        <a class={layoutStyle.tinted} href={href} title={text} target="_blank" rel="noopener noreferrer">
            {typeof image === "string" ? <img src={image} alt={text} /> : image} {text}
        </a>
    );
};
