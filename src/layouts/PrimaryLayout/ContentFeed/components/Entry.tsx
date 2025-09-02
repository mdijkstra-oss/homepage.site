import Markdown from "react-markdown";

import {useCommandExecution} from "./useCommandExecution";
import { ExecutingCommand } from "@/domain/command/exec/exec";

import style from './style.module.css'
import {ContentBox} from "@/components/ContentBox/ContentBox";
import {TagList} from "@/components/Tag/List";

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
            <div className={style.prompt}>
                <ContentBox variant="secondary">
                    {sequence.map((c) => c.name).join(":")}
                </ContentBox>
            </div>


            <div className={style.result}>
                <ContentBox variant="primary">
                    <Markdown>{result.payload}</Markdown>
                    { result.meta?.tags && <TagList tags={result.meta.tags} /> }
                </ContentBox>
            </div>
        </>
    );
};

export default Entry;
