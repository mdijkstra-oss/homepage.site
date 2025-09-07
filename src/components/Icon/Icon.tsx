import moduleStyle from "./style.module.scss";
import {iconMapping} from "@/components/Icon/icons";

export const availableIcons = Object.keys(iconMapping);

export type AvailableIcon = keyof typeof iconMapping;

export interface IconProps {
    name: AvailableIcon;
    tint?: string;
}

export const Icon = ({ name, tint = null }: IconProps)=>  {
    const icon = iconMapping[name]

    return (
        <span className={moduleStyle.icon} style={{ color: tint || icon.color }}>
            <div dangerouslySetInnerHTML={{ __html: icon.svgString }} />
        </span>
    );
}
