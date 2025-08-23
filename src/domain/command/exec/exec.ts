import {Command, CommandList} from "@/domain/command/parse/parse";
import * as Commands from '../commands'
import {collectStr} from "@/utils/stream";

export type ExecResult = {
    payload: string,
    meta?: {
        tags?: string[],
        isError?: boolean
    }
}

export type ExecStream = AsyncIterable<ExecResult>;

export type ExecutingCommand = {
    name: string,
    stdout: ExecStream
}

export interface Executor {
    (command: Command, stream: ExecStream): ExecStream;
}

export function toPipeline(commands: CommandList): ExecStream {
    let input: ExecStream | undefined;

    for (const cmd of commands) {
        const executor = executorForName(cmd.name);
        input = executor(cmd, input);
    }

    return input ?? (async function* () {})();
}

function executorForName(name: string): Executor {
    const command = Commands[name.toLowerCase()];
    if (!command) {
        throw new Error(`command not found: ${name}`);
    }
    return command;
}
