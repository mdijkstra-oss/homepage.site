import {CommandExecutor, ExecutedCommand} from "@/domain/command/exec";
import {Command} from "@/domain/command/parse";
import {reverse} from "@/utils/string";

export const rev: CommandExecutor = (command: Command): ExecutedCommand => ({
    ...command,
    stdout: reverse(command.stdin)
})