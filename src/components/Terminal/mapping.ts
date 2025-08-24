// Todo: Add tests for more scenarios
export function mapCommandToRoute(commandStr: string): string {
    const urlSafe = commandStr
        .replace(/\s*\|\s*/g, '/')
        .replace(/\s+(--)/g, '$1');

    return `/${urlSafe}`
}

export function mapRouteToCommand(route: string): string {
    return decodeURIComponent(route)
        .replace(/\//g, ' | ')
        .replace(/\s+/g, ' ')
        .trim();
}

