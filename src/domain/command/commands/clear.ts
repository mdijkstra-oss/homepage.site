import {CommandHandler} from "@/domain/command/types";
import {nopExecutor} from "@/domain/command/utils";

export const clear: CommandHandler = {
    executor: nopExecutor,
    help: {
        short: 'Clear screan',
    }
};
