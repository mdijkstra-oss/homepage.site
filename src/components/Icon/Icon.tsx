import {
    siAwsfargate,
    siCodeberg,
    siDocker,
    siKubernetes,
    SimpleIcon,
    siNodedotjs,
    siPhp,
    siTypescript
} from "simple-icons";
import Linkedin from "@/assets/linkedin.svg";
import { CSSProperties } from "react";

import moduleStyle from "./style.module.css";

type IconValue = {
    svgString: string;
    color: string;
    title: string;
}

export const iconMapping: { [key: string]: IconValue } = {
    typescript: iconValueFromSI(siTypescript),
    node: iconValueFromSI(siNodedotjs),
    linkedin: iconValueFromDataUrl(Linkedin, "#0A66C2", "Linkedin"),
    aws: iconValueFromSI(siAwsfargate),
    kubernetes: iconValueFromSI(siKubernetes),
    php: iconValueFromSI(siPhp),
    codeberg: iconValueFromSI(siCodeberg),
    docker: iconValueFromSI(siDocker),
};

export const availableIcons = Object.keys(iconMapping);

export type AvailableIcon = keyof typeof iconMapping;

export interface IconProps {
    name: AvailableIcon;
    tint?: string;
    style?: CSSProperties
}

export const Icon = ({ name, tint = null, style = {} }: IconProps)=>  {
    const icon = iconMapping[name]

    return (
        <span className={moduleStyle.icon} style={{ ...style, color: tint || icon.color }}>
            <div dangerouslySetInnerHTML={{ __html: icon.svgString }} />
        </span>
    );
}

function dataUrlToSvgString (dataUrl: string): string {
    if (!isThemeableSvg(dataUrl)) {
        throw new Error("Imported data url is not a themable SVG")
    };

    return decodeURIComponent(dataUrl.replace('data:image/svg+xml,', ''));
}

function isThemeableSvg(dataUrl: string) {
    if (!dataUrl.startsWith('data:image/svg+xml,')) return false;
    const svgString = decodeURIComponent(dataUrl.replace('data:image/svg+xml,', ''));
    if (svgString.includes('fill="#') || svgString.includes('stroke="#')) return false;
    return true;
}


function iconValueFromSI(si: SimpleIcon): IconValue {
    return {
        svgString: si.svg,
        color: `#${si.hex}`,
        title: si.title
    }
}

function iconValueFromDataUrl(dataUrl: string, color: string, title: string): IconValue {
    return {
        svgString: dataUrlToSvgString(dataUrl),
        color,
        title,
    }
}