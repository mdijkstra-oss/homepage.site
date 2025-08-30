import { fetch } from './fetch'
import { uppercase } from './uppercase'
import { clear } from './clear'

export const availableCommands = {
    fetch,
    uppercase,
    clear
} as const

export type CommandName = keyof typeof availableCommands;

export function isValidCommandName(name: string): name is CommandName {
    return name in availableCommands;
}
