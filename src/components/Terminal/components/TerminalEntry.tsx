import {FunctionalComponent} from "preact";
import {ExecResult, ExecutingCommand} from "@/domain/command/exec/exec";

import './style.css'
import {useEffect, useState} from "preact/hooks";
import {errorResult} from "@/domain/command/commands/utils";

interface TerminalEntryProps {
    exec: ExecutingCommand;
}

const TerminalEntry: FunctionalComponent<TerminalEntryProps> = ({ exec }) => {

    const { commands, stdout } = exec

    const [execResult, setExecResult] = useState<ExecResult | undefined>()

    useEffect(() => {
        let cancelled = false;

        async function processStream() {
            try {
                for await (const entry of stdout) {
                    setExecResult(entry);
                    if (cancelled) return;
                }
            }
            catch (error) {
                setExecResult(errorResult(error))
            }
        }

        void processStream();

        return () => {
            cancelled = true;
        };
    }, [exec]);

    if (!execResult) {
        return null;
    }

    return (
        <div className="terminal-command">
            <div className="terminal-input">{ commands.map((c) => c.name).join(":") }</div>
            { execResult && <div className="terminal-output terminal-stdout">{execResult.result}</div> }
        </div>
    );
};


export default TerminalEntry