import style from './style.module.css'
import {AvailableIcon, Icon, iconMapping} from "@/components/Icon/Icon";

import vars from '@/variables.module.css'
import {classnames} from "@/utils/css";

export interface TagProps {
    name: AvailableIcon;
    transparent?: boolean;
}

export const Tag = ({ name, transparent = false }: TagProps) => {
    const icon = iconMapping[name]

    if(!icon) throw new Error(
        `Icon ${name} not found in iconMapping`
    )

    const color = transparent ? "transparent" : icon.color;

    return (
        <span className={classnames(style.tag, { [style.transparent]: transparent })} style={{ backgroundColor: color }}>
            <span className={style.icon}><Icon name={name} tint={vars.textLight} /></span> <span className={style.title}>{icon.title}</span>
        </span>
    )
}