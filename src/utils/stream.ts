export async function collectStr(stream: AsyncIterable<string>): Promise<string> {
    let result = '';
    for await (const chunk of stream) {
        result += chunk;
    }
    return result;
}
