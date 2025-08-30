import {CommandHandler} from "@/domain/command/types";
import {anyInput, updatePayload} from "@/domain/command/utils";

export const uppercase: CommandHandler = {
    executor: async function* (command, stdin?) {
        const input = await anyInput(command, stdin);
        yield updatePayload(input, input.payload.toUpperCase());
    },
    help: {
        short: 'Convert input to uppercase',
        long: 'Reads input from stdin or arguments and outputs the uppercase version of the payload.'
    }
};
