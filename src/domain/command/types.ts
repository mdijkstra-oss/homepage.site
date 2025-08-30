import {ExecStream} from "@/domain/command/exec/exec";
import {Command} from "@/domain/command/parse/parse";

export type CommandHandler = {
    executor: (command: Command, stdin?: ExecStream) => ExecStream;
    help?: { short?: string; long?: string };
}
