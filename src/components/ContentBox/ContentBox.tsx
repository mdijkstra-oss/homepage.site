import { ReactNode } from 'react';
import { classnames } from '@/utils/css';
import styles from './style.module.css';

export const contentBoxVariants = ['primary', 'secondary'] as const;
export type ContentBoxVariant = typeof contentBoxVariants[number];


export interface ContentBoxProps {
    children: ReactNode;
    variant?: ContentBoxVariant;
}

export const ContentBox = ({ children, variant = 'primary' }: ContentBoxProps) => {
    const className = classnames(styles.contentBox, styles[variant]);

    return <div className={className}>{children}</div>;
};
