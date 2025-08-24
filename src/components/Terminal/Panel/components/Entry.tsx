import { FunctionalComponent } from "preact";
import Markdown from "react-markdown";

import {useCommandExecution} from "./useCommandExecution";
import { ExecutingCommand } from "@/domain/command/exec/exec";

interface TerminalEntryProps {
    exec: ExecutingCommand;
}

const Entry: FunctionalComponent<TerminalEntryProps> = ({ exec }) => {
    const { commands, stdout } = exec;
    const result = useCommandExecution(stdout);

    if (!result) {
        return null;
    }

    return (
        <div className="terminal-command">
            <div className="terminal-input">{commands.map((c) => c.name).join(":")}</div>
            <div className="terminal-output terminal-stdout">
                <Markdown>{result.payload}</Markdown>
            </div>
        </div>
    );
};

export default Entry;
