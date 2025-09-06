import {Board} from "./board";
import {map2D, padGrid, size, wrapped} from "./utils";
import * as stamps from "./stamps";

export const STAMPS = Object.values(stamps).map((s) => padGrid(s, 0))

export function stamp(
    target: Board,
    source: Board,
    atX: number,
    atY: number
): Board {
    const [sourceH, sourceW] = size(source);
    const result = target.map(row => [...row]);

    for (let sy = 0; sy < sourceH; sy++) {
        for (let sx = 0; sx < sourceW; sx++) {
            const tx = wrapped(atX + sx, result[0].length);
            const ty = wrapped(atY + sy, result.length);
            result[ty][tx] = source[sy][sx];
        }
    }

    return result;
}

export function canFit(
    target: Board,
    source: Board,
    atX: number,
    atY: number
): boolean {
    for (let y = 0; y < source.length; y++) {
        for (let x = 0; x < source[0].length; x++) {
            const targetY = wrapped(y + atY, target.length);
            const targetX = wrapped(x + atX, target[0].length);
            if (target[targetY][targetX] === 1) return false;
        }
    }
    return true;
}

export function averageSize(stamps: Board[] ): number {
    const sizes = stamps.map(size).map(([height, width]) => height * width);
    return sizes.reduce((a, b) => a + b, 0) / sizes.length;
}