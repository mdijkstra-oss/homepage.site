export const QUOTE_CHARS: readonly string[] = ['"', "'"]

export function trimChars(str: string, chars: readonly string[] = [' ']): string {
    const charSet = new Set(chars);

    let start = 0;
    let end = str.length - 1;

    while (start <= end && charSet.has(str[start])) {
        start++;
    }

    while (end >= start && charSet.has(str[end])) {
        end--;
    }

    return str.slice(start, end + 1);
}

export function reverse(str: string): string {
    return str.split('').reverse().join('');
}

export function printJSON(obj: any) {
    console.log(JSON.stringify(obj, null, 2));
}