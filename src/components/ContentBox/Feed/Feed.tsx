import {ContentBox, ContentBoxProps} from "../Box/ContentBox"
import style from './style.module.scss'
import {classnames} from "@/utils/css";

export type ContentFeed = ContentBoxProps[]

export interface ContentBoxFeedProps {
    feed: ContentFeed
}

export const ContentBoxFeed = ({feed}: ContentBoxFeedProps) => {
    return (
        <div className={style.feed}>
            {feed.map(({variant, children, key}) => (
                <div className={classnames(style.entry, style[variant])} key={key}>
                    <ContentBox key={variant} variant={variant}>
                        {children}
                    </ContentBox>
                </div>
            ))}
        </div>
    )
}
