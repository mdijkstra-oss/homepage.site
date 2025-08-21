import {FunctionalComponent} from "preact";

import {SiCodeberg} from '@icons-pack/react-simple-icons';

export const icons = {
    // linkedin: SiLinkedin,
    codeberg: SiCodeberg
}

type IconName = keyof typeof icons;

interface IconProps {
    iconName: IconName;
    link: string;
}

const Icon: FunctionalComponent<IconProps> = ({ iconName, link }) => {
    return (
        <a href={ link } target="_blank" rel="noopener noreferrer">
            { icons[iconName] || "MISSING ICON" }
        </a>
    );
}

export default Icon;
