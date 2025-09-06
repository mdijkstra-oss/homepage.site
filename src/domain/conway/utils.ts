export function padGrid<T>(grid: T[][], char: T, width: number = 1) {
    const newLength = grid[0].length + 2 * width;

    const row = () => Array(newLength).fill(char);
    const col = () => Array(width).fill(char);

    return [
        row(),
        ...grid.map(row => [...col(), ...row, ...col()]),
        row()
    ]
}

export function map2D<T, U>(grid: T[][], fn: (cell: T, x: number, y: number, grid: T[][]) => U) {
    return grid.map((row, y) => {
        return row.map((cell, x) => fn(cell, x, y, grid));
    });
}

export function cellAtPos<T>(grid: T[][], x: number, y: number): T | undefined {
    const height = grid.length;
    const width = grid[0].length;

    return grid[wrapped(y, height)][wrapped(x, width)];
}

export function wrapped(n: number, length: number) {
    return ((n % length) + length) % length;
}

// [height, width]
export function size<T>(grid: T[][]): [number, number] {
    return [grid.length, grid[0].length]
}