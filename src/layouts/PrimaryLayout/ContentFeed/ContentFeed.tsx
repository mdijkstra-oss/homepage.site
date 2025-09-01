import Entry from "./components/Entry";
import {ExecutingCommand} from "@/domain/command/exec/exec";

interface TerminalProps {
    commands: ExecutingCommand[];
}

export const ContentFeed = ({ commands = [] }: TerminalProps) => {
    return (
        <div className="terminal">
            {commands.map((command, index) => (
                <Entry key={index} exec={command} />
            ))}
        </div>
    );
};
