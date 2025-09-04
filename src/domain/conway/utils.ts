
export function xyFromIndex(index: number, width: number, height: number) {
    const normalizedIndex = ((index % (width * height)) + (width * height)) % (width * height);
    return {
        x: normalizedIndex % width,
        y: Math.floor(normalizedIndex / width)
    };
}

export function indexFromXY(x: number, y: number, width: number, height: number) {
    const wrappedX = ((x % width) + width) % width;
    const wrappedY = ((y % height) + height) % height;
    return wrappedY * width + wrappedX;
}

export function cellAtPos<T>(oneDimensionalBoard: T[], width: number, height: number, x: number, y: number): T | undefined {
    const idx = indexFromXY(x, y, width, height);
    return oneDimensionalBoard[idx];
}