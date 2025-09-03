import Markdown from "react-markdown";

import {useCommandExecution} from "./useCommandExecution";
import {ExecResult, ExecutingCommand} from "@/domain/command/exec/exec";

import {ContentBoxProps} from "@/components/ContentBox/Box/ContentBox";
import {TagList} from "@/components/Tag/List";
import {ContentBoxFeed} from "@/components/ContentBox/Feed/Feed";
import {CommandSequence} from "@/domain/command/parse/parse";

interface TerminalEntryProps {
    exec: ExecutingCommand;
}

const Entry = ({ exec }: TerminalEntryProps) => {
    const { sequence, stdout } = exec;
    const result = useCommandExecution(stdout);

    if (!result) {
        return null;
    }

    const feed = mapToFeed(sequence, result);
    return <ContentBoxFeed feed={feed} />
};

function mapToFeed(sequence: CommandSequence, result: ExecResult): ContentBoxProps[] {
    if (!result) { return [] }

    return [
        {
            variant: "secondary",
            children: sequence.map((c) => c.name).join(":")
        },
        {
            variant: "primary",
            children: (
                <>
                    <Markdown>{result.payload}</Markdown>
                    { result.meta?.tags && <TagList tags={result.meta.tags} /> }
                </>
            )
        }
    ]
}

export default Entry;
