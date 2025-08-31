import { FunctionalComponent } from "preact";
import Markdown from "react-markdown";

import {useCommandExecution} from "./useCommandExecution";
import { ExecutingCommand } from "@/domain/command/exec/exec";

import style from './style.module.css'
import layoutStyle from '@/components/PrimaryLayout/layout.module.css'
import {classnames} from "@/utils/css";
import {Tag} from "@/components/Tag";

interface TerminalEntryProps {
    exec: ExecutingCommand;
}

const Entry: FunctionalComponent<TerminalEntryProps> = ({ exec }) => {
    const { sequence, stdout } = exec;
    const result = useCommandExecution(stdout);

    if (!result) {
        return null;
    }

    return (
        <>
            <div class={classnames(layoutStyle.contentBox, layoutStyle.primary, style.prompt)}>{sequence.map((c) => c.name).join(":")}</div>

            <div class={classnames(layoutStyle.contentBox, style.result)}>
                <Markdown>{result.payload}</Markdown>

                {result.meta?.tags && result.meta.tags.map((tag) => <Tag name={tag} />)}
            </div>
        </>
    );
};

export default Entry;
