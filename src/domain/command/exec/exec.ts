import {CommandSequence, Command} from "@/domain/command/parse/parse";

import {CommandHandler} from "@/domain/command/types";

import {availableCommands, isValidCommandName} from '../commands'

export type ExecResult = {
    payload: string,
    meta?: {
        tags?: string[],
        isError?: boolean
    }
}

export type ExecStream = AsyncIterable<ExecResult>;

export type ExecutingCommand = {
    sequence: CommandSequence,
    stdout: ExecStream,
}

export interface Executor {
    (command: Command, stream: ExecStream): ExecStream;
}

export function toPipeline(commands: CommandSequence): ExecStream {
    let input: ExecStream | undefined;

    for (const cmd of commands) {
        const handler = handlerForName(cmd.name);
        input = handler.executor(cmd, input);
    }

    return input ?? (async function* () {})();
}

function handlerForName(name: string): CommandHandler {
    if (!isValidCommandName(name)) {
        throw new Error(`invalid command name: ${name}`);
    }

    return availableCommands[name];
}
