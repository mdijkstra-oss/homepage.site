import {FunctionalComponent} from "preact";
import {ExecResult, ExecStream, ExecutingCommand} from "@/domain/command/exec/exec";

import './style.css'
import {useEffect, useReducer, useState} from "preact/hooks";
import {errorResult} from "@/domain/command/commands/utils";

interface TerminalEntryProps {
    stdout: ExecStream;
    title: string
}

const TerminalEntry: FunctionalComponent<TerminalEntryProps> = ({ stdout, title }) => {

    const [result, setResult] = useState<ExecResult | undefined>()

    useEffect(() => {
        let cancelled = false;

        async function processStream() {
            try {
                for await (const entry of stdout) {
                    setResult(entry);
                    if (cancelled) return;
                }
            }
            catch (error) {
                setResult(errorResult(error))
            }
        }

        void processStream();

        return () => {
            cancelled = true;
        };
    }, [stdout]);

    return (
        <div className="terminal-command">
            <div className="terminal-input">{title}</div>
            { result && <div className="terminal-output terminal-stdout">{result.payload}</div> }
        </div>
    );
};


export default TerminalEntry