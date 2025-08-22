import {Command} from "@/domain/command/parse/parse";
import {collectStr} from "@/utils/stream";
import {ExecStream, Executor} from "@/domain/command/exec/exec";

export function createAggregatingExecutor(
    fn: (input: string) => string | ExecStream
): Executor {
    return async function* (command: Command, stdin?: ExecStream): ExecStream {
        const input = stdin ? await collectStr(stdin) : command.args.join(' ');
        const result = fn(input);
        if (typeof result === 'string') {
            yield result;
        } else {
            yield* result;
        }
    };
}
