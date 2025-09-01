import Markdown from "react-markdown";

import {useCommandExecution} from "./useCommandExecution";
import { ExecutingCommand } from "@/domain/command/exec/exec";

import style from './style.module.css'
import layoutStyle from '@/layouts/PrimaryLayout/layout.module.css'
import {classnames} from "@/utils/css";
import {Tag} from "@/components/Tag";

interface TerminalEntryProps {
    exec: ExecutingCommand;
}

const Entry = ({ exec }: TerminalEntryProps) => {
    const { sequence, stdout } = exec;
    const result = useCommandExecution(stdout);

    if (!result) {
        return null;
    }

    return (
        <>
            <div className={classnames(layoutStyle.contentBox, layoutStyle.primary, style.prompt)}>{sequence.map((c) => c.name).join(":")}</div>

            <div className={classnames(layoutStyle.contentBox, style.result)}>
                <Markdown>{result.payload}</Markdown>

                {result.meta?.tags && result.meta.tags.map((tag) => <Tag name={tag} />)}
            </div>
        </>
    );
};

export default Entry;
