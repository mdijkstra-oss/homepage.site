import {CommandExecutor, ExecutedCommand} from "@/domain/command/exec";
import {Command} from "@/domain/command/parse";

export const echo: CommandExecutor = (command: Command): ExecutedCommand => ({
    ...command,
    stdout: command.args.join(' '),
})