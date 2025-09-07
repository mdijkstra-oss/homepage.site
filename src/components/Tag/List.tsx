import {AvailableIcon} from "@/components/Icon/Icon";
import style from "@/components/Tag/style.module.scss";
import {Tag} from "@/components/Tag/Tag";


export interface TagListProps {
    tags: AvailableIcon[];
}

export const TagList = ({ tags }: { tags: AvailableIcon[] }) => (
    <ul className={style.list}>
        {tags.map(tag => (
            <li key={tag}>
                <Tag name={tag} />
            </li>
        ))}
    </ul>
)
