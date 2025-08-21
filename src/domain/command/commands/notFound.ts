import {CommandExecutor, ExecutedCommand} from "@/domain/command/exec";
import {Command} from "@/domain/command/parse";

export const notFound: CommandExecutor = (command: Command): ExecutedCommand => ({
    ...command,
    stderr: `Command not found: ${command.name}`,
})