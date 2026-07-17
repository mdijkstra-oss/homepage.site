import { Tag } from '../../Tag/Tag';
import styles from './TagList.module.css';

interface TagListProps {
  tags: string[];
  marginTop: number;
}

export function TagList({ tags, marginTop }: TagListProps) {
  return (
    <div className={`${styles.list} ${marginTop === 16 ? styles.margin16 : styles.margin18}`}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
