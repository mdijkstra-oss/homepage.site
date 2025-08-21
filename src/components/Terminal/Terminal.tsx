import {FunctionalComponent} from 'preact';
import TerminalEntry from "@/components/Terminal/components/TerminalEntry";
import {ExecutedCommand} from "@/domain/command/exec";

interface TerminalProps {
    executedCommands: ExecutedCommand[];
}

const Terminal: FunctionalComponent<TerminalProps> = ({ executedCommands = [] }) => {
    return (
        <div class="terminal">
            {executedCommands.map((command, index) => (
                <TerminalEntry key={index} command={command} />
            ))}
        </div>
    );
};

export default Terminal;