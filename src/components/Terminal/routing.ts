// Todo: Add tests for more scenarios
import {serialize, deserialize, CommandSequence, commandStringToCommandSequence} from "@/domain/command/parse/parse";
import {shortB64Decode, shortB64Encode, trimChars} from "@/utils/string";

const defaultRoutes = {
    home: ["fetch", "fetch | uppercase"]
}

export function mapCommandSequencesToRoute(list: CommandSequence[]): string {
    const concatenated = list.map(serialize).join('\n');
    return shortB64Encode(concatenated)
}

export function mapRouteToCommandSequences(route: string): CommandSequence[] {
    const path = trimChars(route, ["/"]);
    const defaultRoute = resolveDefaultRoute(path);

    if (defaultRoute) {
        return defaultRoute.map(commandStringToCommandSequence);
    }

    try {
        const entries = shortB64Decode(trimChars(route, ["/"])).split('\n');
        return entries.map(deserialize);
    }
    // Ignoring invalid urls
    catch (error) {
        console.error(error)
    }

    return []
}

function resolveDefaultRoute(path: string): string[] | undefined {
    return defaultRoutes[path.toLowerCase()];
}