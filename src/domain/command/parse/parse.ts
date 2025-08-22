import {Maybe} from "@/utils/types";
import {QUOTE_CHARS, trimChars} from "@/utils/string";

export interface Command {
    name: string;
    args: string[];
    argd?: ArgsDictionary;
}

export enum ControlOperator {
    Pipe = "|",
}

export type CommandList = (Command)[];

type ArgsDictionary = {
    [key: string]: string | boolean;
};

function isCommand(item: Command | ControlOperator): item is Command {
    return typeof item === "object" && "name" in item && "args" in item;
}

function isControlOperator(item: Command | ControlOperator | string): item is ControlOperator {
    return Object.values(ControlOperator).includes(item as ControlOperator);
}

export function parseCommand(cmd: string): CommandList {
    return parseCommandBase(cmd).map((cmd) => {
        if(isCommand(cmd)) {
            return { ...cmd, argd: parseArgs(cmd.args) };
        }
        return cmd
    })
}

function parseCommandBase(cmd: string): CommandList {
    const result: CommandList = [];
    const tokens = cmd.match(/(?:[^\s"']+|['"][^'"]*['"])+/g) || [];

    let currentCommand: Maybe<Command> = null;

    for (const token of tokens) {
        if (isControlOperator(token)) {
            // todo: differentiate between | and && - now just pipe until end
            // result.push(token as ControlOperator);
            currentCommand = null;
        } else {
            if (!currentCommand) {
                currentCommand = {name: token, args: []};
                result.push(currentCommand);
            } else {
                currentCommand.args.push(trimChars(token, QUOTE_CHARS));
            }
        }
    }

    return result;
}

export function parseArgs(args: string[]): ArgsDictionary {
    const result: ArgsDictionary = {};
    // immutability
    args = args.slice();

    while (args.length > 0) {
        const arg = args.shift()!;

        if (arg.startsWith("-")) {
            const key = arg.startsWith("--") ? arg.substring(2) : arg.substring(1);

            if (args.length > 0 && !args[0].startsWith("-")) {
                result[key] = args.shift()!;
            } else {
                result[key] = true;
            }
        } else if (arg.includes("=")) {
            const [key, value] = arg.split("=");
            result[key] = value;
        } else {
            result[arg] = true;
        }
    }

    return result;
}