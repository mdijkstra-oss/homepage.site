import {ExecResult, ExecStream} from "@/domain/command/exec/exec";
import { Command } from "@/domain/command/parse/parse";

export async function anyInput(
    command: Command,
    stdin?: ExecStream
): Promise<ExecResult> {
    if (stdin) {
        const iterator = stdin[Symbol.asyncIterator]();
        const result = await iterator.next();
        return result.value;
    }
    return metaLessResult(command.args.join(' '));
}

export function metaLessResult(payload: string): ExecResult {
    return { payload: payload }
}

export function updatePayload(result: ExecResult, payload: string): ExecResult {
    return { ...result, payload }
}

export function errorResult(error: string | Error): ExecResult {
    return {
        payload: typeof error == "string" ? error : error.message,
        meta: {
            isError: true
        }
    }
}


export const nopExecutor = <T>(command: Command, stdin?: AsyncIterable<T>): AsyncIterable<T> =>
    stdin ?? (async function* () {})();