import {Command, CommandList, ControlOperator} from "@/domain/command/parse";
import * as Commands from './commands'
import {error, Maybe, Result, success} from "@/utils/types";

export type ExecutedCommand = Command & {
    stderr?: string;
    stdout?: string;
}

export interface CommandExecutor {
    (command: Command): ExecutedCommand;
}


export function executeCommands(commands: CommandList): Result<ExecutedCommand> {
    if (commands.length === 0) {
        return error('No commands to execute');
    }

    let prev: Maybe<ExecutedCommand> = null;

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        if (command === ControlOperator.Pipe) {
            continue;
        }

        const input = i > 0 && commands[i - 1] === ControlOperator.Pipe && prev
            ? { ...command, stdin: prev.stdout }
            : command;

        const executor = executorForName(command.name);
        const executed = executeCommand(input, executor);

        if (executed.stderr) {
            return success(executed); // diff between could not execute command (due to missing) and command outputs an error
        }

        prev = executed;
    }

    return success(prev);
}


function executeCommand(command: Command, executor: CommandExecutor): ExecutedCommand {
    return executor(command);
}

function executorForName(name: string): CommandExecutor {
    return Commands[name] || Commands.notFound;
}

