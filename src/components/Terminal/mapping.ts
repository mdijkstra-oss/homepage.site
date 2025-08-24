// Todo: Add tests for more scenarios
import {trimChars} from "@/utils/string";

export function mapCommandToRoute(commandStr: string): string {
    const urlSafe = trimChars(commandStr, [' '])
        .replace(/\s+/g, ' ')
        .replace(/\s*\|\s*/g, '/')
        .replace(/\s+(--)/g, '$1')
        .replace(/=/g, "_")

    return `/${urlSafe}`
}

export function mapRouteToCommand(route: string): string {
    return decodeURIComponent(trimChars(route, ['/', ' ']))
        .replace(/\//g, ' | ')
        .replace(/\s+/g, ' ')
        .replace(/_/g, '=')
        .replace(/--/g, ' --')
}

