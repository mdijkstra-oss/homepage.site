import React from 'react'
import { Prompt, Reply } from '@/domain/prompt/prompt'
import { ContentBoxFeed, ContentFeed } from '@/components/ContentBox/Feed/Feed'
import ReactMarkdown from 'react-markdown'

import style from './style.module.scss'
import { TagList } from '@/components/Tag/List'

export interface PromptFeedProps {
  prompt: Prompt
}

export const PromptFeed = ({ prompt }: PromptFeedProps) => {
  const feed = mapToFeed(prompt)
  return <ContentBoxFeed feed={feed} />
}

const mapToFeed = ({ message, replies }: Prompt): ContentFeed => [
  {
    variant: 'secondary',
    children: message,
    key: message,
  },
  ...toReplyFeed([...replies.values()]),
]

function toReplyFeed(replies: Reply[]): ContentFeed {
  return replies.map((reply) => ({
    variant: 'primary',
    children: <ReplyContent {...reply} />,
    key: reply.id,
  }))
}

const ReplyContent = ({ title, content, meta: { date, endDate, tags, image } }: Reply) => (
  <>
    <div className={style.heading}>
      <h2>{title}</h2>
      <Date date={date} endDate={endDate} />
    </div>
    <div className={style.content}>
      {image && <img className={style.image} src={image} alt={title} />}
      <div className={style.text}>
        <ReactMarkdown
          components={{
            a: ExternalLink,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
    <div className={style.footer}>{tags && <TagList tags={tags} />}</div>
  </>
)

interface DateProps {
  date: string
  endDate: string
}

const Date = ({ date, endDate }: DateProps) => {
  if (!date) return null

  return (
    <div className={style.dates}>
      <span>{date}</span> {endDate && <span> - {endDate}</span>}
    </div>
  )
}

const ExternalLink = ({ href, children }) => (
  <a href={href} rel="nofollow">
    {children}
  </a>
)
