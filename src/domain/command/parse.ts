import {Maybe} from "@/utils/types";
import {QUOTE_CHARS, trimChars} from "@/utils/string";

interface Parse {
    name: string;
    args: string[];
    argd?: ArgsDictionary;
}

enum ControlOperator {
    Pipe = "|",
    And = "&&",
    Or = "||"
}

function isCommand(item: Parse | ControlOperator): item is Parse {
    return typeof item === "object" && "name" in item && "args" in item;
}

function isControlOperator(item: Parse | ControlOperator | string): item is ControlOperator {
    return Object.values(ControlOperator).includes(item as ControlOperator);
}

type ArgsDictionary = {
    [key: string]: string | boolean;
};

type CommandList = (Parse | ControlOperator)[];

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

    let currentCommand: Maybe<Parse> = null;

    for (const token of tokens) {
        if (isControlOperator(token)) {
            result.push(token as ControlOperator);
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