import {ExecStream, Executor} from "@/domain/command/exec/exec";
import {anyInput, updatePayload} from "@/domain/command/commands/utils";

export const uppercase: Executor = async function* (command, stdin?) {
    const input = await anyInput(command, stdin);
    yield updatePayload(input, input.result.toUpperCase())
}