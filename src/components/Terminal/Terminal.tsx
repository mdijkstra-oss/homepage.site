import {FunctionalComponent} from 'preact';
import TerminalEntry from "@/components/Terminal/components/TerminalEntry";
import {ExecutingCommand} from "@/domain/command/exec/exec";

interface TerminalProps {
    commands: ExecutingCommand[];
}

const Terminal: FunctionalComponent<TerminalProps> = ({ commands = [] }) => {
    return (
        <div class="terminal">
            {commands.map((command, index) => (
                <TerminalEntry key={index} exec={command} />
            ))}
        </div>
    );
};

export default Terminal;