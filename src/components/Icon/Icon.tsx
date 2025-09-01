import { siNodedotjs, siTypescript } from "simple-icons";
import Linkedin from "@/assets/linkedin.svg";
import { CSSProperties } from "react";

import moduleStyle from "./style.module.css";

const mapping: { [key: string]: string } = {
    typescript: siTypescript.svg,
    node: siNodedotjs.svg,
    linkedin: dataUrlToSvgString(Linkedin),
};

export const availableIcons = Object.keys(mapping);

type AvailableIcon = keyof typeof mapping;

export interface IconProps {
    name: AvailableIcon;
    tint?: string;
    style?: CSSProperties
}

export const Icon = ({ name, tint = "black", style = {} }: IconProps)=>  {
    const icon = mapping[name]

    return (
        <span className={moduleStyle.icon} style={{ ...style, color: tint }}>
            <div dangerouslySetInnerHTML={{ __html: icon }} />
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