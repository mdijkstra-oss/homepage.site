export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function delayRand(min = 0, max = 50) {
    return delay(min + Math.random() * (max - min));
}
