import {FunctionalComponent} from "preact";
import style from './style.module.css'

import {SimpleIcon, siNodedotjs, siTypescript} from "simple-icons";

type Icon = {
    name: string;
    color: string;
    icon: string;
}

const iconFromSi = (icon: SimpleIcon): Icon => ({
    name: icon.title,
    color: icon.hex,
    icon: icon.svg
})

const mapping: { [key: string ]: Icon } = {
    typescript: iconFromSi(siTypescript),
    node: iconFromSi(siNodedotjs)
}

function tagFromName(name: string) {
    return mapping[name]
}

interface TagProps {
    name: string;
}

export const Tag: FunctionalComponent<TagProps> = ({ name }) => {
    const tag = tagFromName(name)
    if (tag) {
        return (
            <span class={style.tag} style={{ background: `#${tag.color}` }}>
                <div dangerouslySetInnerHTML={{ __html: tag.icon }} /> <span>{tag.name}</span>
            </span>
        )
    }

    console.warn(`Missing tag: ${name}`)
    return null

}