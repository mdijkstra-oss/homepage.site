import {useEffect, useState} from "preact/hooks";
import {ExecResult, ExecStream} from "@/domain/command/exec/exec";
import {errorResult} from "@/domain/command/commands/utils";

export function useCommandExecution(stdout: ExecStream): ExecResult {
    const [execResult, setExecResult] = useState<ExecResult | undefined>();

    useEffect(() => {
        let cancelled = false;

        async function processStream() {
            try {
                for await (const entry of stdout) {
                    if (cancelled) return;
                    setExecResult(entry as ExecResult);
                }
            } catch (error) {
                setExecResult(errorResult(error));
            }
        }

        void processStream();

        return () => {
            cancelled = true;
        };
    }, [stdout]);

    return execResult;
}