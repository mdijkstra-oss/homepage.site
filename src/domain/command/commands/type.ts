import {delayRand} from "@/utils/async";
import {ExecStream, Executor} from "@/domain/command/exec/exec";
import {Command} from "@/domain/command/parse/parse";

export const type: Executor = async function* (command: Command, stdin?: ExecStream): ExecStream {
    const source = stdin ?? [command.args.join(' ')];

    for await (const chunk of source) {
        for (const char of chunk) {
            yield char;
            await delayRand();
        }
    }
};
