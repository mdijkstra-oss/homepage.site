import {Command} from "@/domain/command/parse/parse";
import {ExecStream, Executor} from "@/domain/command/exec/exec";

export const echo: Executor = async function* (command: Command, stdin?: ExecStream): ExecStream {
    if (stdin) {
        yield *stdin;
    } else {
        yield command.args.join(' ');
    }
};
