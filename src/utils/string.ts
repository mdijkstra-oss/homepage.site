export const QUOTE_CHARS = ['"', "'"]

export function trimChars(str: string, chars: string[] = [' ']): string {
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