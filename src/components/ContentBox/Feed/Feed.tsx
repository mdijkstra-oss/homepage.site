import {ContentBox, ContentBoxProps, ContentBoxVariant} from "../Box/ContentBox"
import style from './style.module.css'
import {classnames} from "@/utils/css";

export interface ContentBoxFeedProps {
    feed: ContentBoxProps[]
}

export const ContentBoxFeed = ({feed}: ContentBoxFeedProps) => {
    return (
        <div className={style.feed}>
            {feed.map(({variant, children}) => (
                <div className={classnames(style.entry, style[variant])}>
                    <ContentBox key={variant} variant={variant}>
                        {children}
                    </ContentBox>
                </div>
            ))}
        </div>
    )
}