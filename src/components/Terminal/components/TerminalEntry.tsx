import {FunctionalComponent} from "preact";
import {ExecutedCommand} from "@/domain/command/exec";

import './style.css'

interface TerminalEntryProps {
    command: ExecutedCommand;
}

const TerminalEntry: FunctionalComponent<TerminalEntryProps> = ({ command }) => {
    return (
        <div class="terminal-command">
            <div class="terminal-input">
                {command.name} {command.args.join(' ')}
            </div>
            {command.stdout && (
                <div class="terminal-output terminal-stdout">
                    {command.stdout}
                </div>
            )}
            {command.stderr && (
                <div class="terminal-output terminal-stderr">
                    {command.stderr}
                </div>
            )}
        </div>
    );
};

export default TerminalEntry