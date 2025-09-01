import style from './style.module.css'
import {AvailableIcon, Icon, iconMapping} from "@/components/Icon/Icon";

import vars from '@/variables.module.css'
import {usePress} from "react-aria";
import {classnames} from "@/utils/css";

export interface TagProps {
    name: AvailableIcon;
    onPress?: (name: AvailableIcon) => void;
}

export const Tag = ({ name, onPress }: TagProps) => {

    const role = onPress ? "button" : "span";

    const icon = iconMapping[name]
    let { pressProps } = usePress({ onPress: () => onPress(name) });

    return (
        <span role={role} { ...pressProps} className={classnames(style.tag, { [style.clickable]: onPress })} style={{ backgroundColor: icon.color }}>
            <span className={style.icon}><Icon name={name} tint={vars.textLight} /></span> <span className={style.title}>{icon.title}</span>
        </span>
    )
}