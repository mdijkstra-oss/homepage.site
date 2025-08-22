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
                <TerminalEntry key={index} title={command.name} stdout={command.stdout} />
            ))}
        </div>
    );
};

export default Terminal;