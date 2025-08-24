import {FunctionalComponent} from 'preact';
import Entry from "./components/Entry";
import {ExecutingCommand} from "@/domain/command/exec/exec";

interface TerminalProps {
    commands: ExecutingCommand[];
}

const Panel: FunctionalComponent<TerminalProps> = ({ commands = [] }) => {
    return (
        <div class="terminal">
            {commands.map((command, index) => (
                <Entry key={index} exec={command} />
            ))}
        </div>
    );
};

export default Panel;