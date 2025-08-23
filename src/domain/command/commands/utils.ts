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
    return { result: payload }
}

export function updatePayload(result: ExecResult, payload: string) {
    return { ...result, payload }
}

export function errorResult(error: string | Error): ExecResult {
    return {
        result: typeof error == "string" ? error : error.message,
        meta: {
            isError: true
        }
    }
}