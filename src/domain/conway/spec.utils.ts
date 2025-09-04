import {cellAtPos, indexFromXY, xyFromIndex} from "./utils";

describe('xyFromIndex', () => {
    test('converts index to correct x, y coordinates', () => {
        expect(xyFromIndex(5, 3, 3)).toEqual({ x: 2, y: 1 });
    });

    test('wraps index within grid bounds', () => {
        expect(xyFromIndex(9, 3, 3)).toEqual({ x: 0, y: 0 });
        expect(xyFromIndex(-1, 3, 3)).toEqual({ x: 2, y: 2 });
    });
});

describe('indexFromXY', () => {
    test('converts x, y to correct index', () => {
        expect(indexFromXY(2, 1, 3, 3)).toBe(5);
    });

    test('wraps negative coordinates correctly', () => {
        expect(indexFromXY(-1, 0, 3, 3)).toBe(2);
        expect(indexFromXY(0, -1, 3, 3)).toBe(6);
    });

    test('wraps large coordinates correctly', () => {
        expect(indexFromXY(3, 0, 3, 3)).toBe(0);
        expect(indexFromXY(0, 3, 3, 3)).toBe(0);
    });
});

describe('cellAtPos', () => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    test('returns correct cell value at valid position', () => {
        expect(cellAtPos(board, 3, 3, 2, 1)).toBe(5);
    });

    test('returns cell value with wrapped coordinates', () => {
        expect(cellAtPos(board, 3, 3, -1, 0)).toBe(2);
        expect(cellAtPos(board, 3, 3, 0, 3)).toBe(0);
    });
});
