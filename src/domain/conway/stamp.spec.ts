import {Board} from "./board";
import {canFit, stamp} from "./stamp";

describe('canFit', () => {
    test('returns false when source overlaps occupied cell in target', () => {
        const target: Board = [[1, 0], [0, 0]];
        const source: Board = [[1, 1], [1, 1]];
        expect(canFit(target, source, 0, 0)).toBe(false);
    });

    test('returns true when source fits without overlap', () => {
        const target: Board = [[0, 0], [0, 0]];
        const source: Board = [[1, 1], [1, 1]];
        expect(canFit(target, source, 0, 0)).toBe(true);
    });

    test('handles wraparound at edges correctly', () => {
        const target: Board = [[1, 0], [0, 0]];
        const source: Board = [[1, 1]];
        expect(canFit(target, source, 1, 0)).toBe(false); // Wraps to (0,0)
    });

    test('returns true when placing at negative offset with wrap', () => {
        const target: Board = [[0, 0], [0, 0]];
        const source: Board = [[1]];
        expect(canFit(target, source, -1, -1)).toBe(true);
    });

    test('returns false when source overlaps after full wrap', () => {
        const target: Board = [[0, 1]];
        const source: Board = [[1]];
        expect(canFit(target, source, 1, 0)).toBe(false); // Wraps to (0,0)
    });
});

describe('stamp', () => {
    const target: Board = [
        [0, 0, 0],
        [0, 0, 0]
    ];
    const source: Board = [
        [1, 1],
    ];

    const stampTest = (expected: Board, x: number, y: number) => {
        const result = stamp(target, source, x, y)
        expect(result).toEqual(expected)
    }

    test('stamps at fitting position', () => {
        stampTest([
            [0, 0, 0],
            [1, 1, 0]
        ], 0, 1);
    });

    test('stamps at wrapping position', () => {
        stampTest([
            [0, 0, 0],
            [1, 0, 1]
        ], 2, 1)
    })

});
