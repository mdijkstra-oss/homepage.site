import {cellAtPos, map2D} from "./utils";

describe('cellAtPos', () => {
    const board = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];

    test('returns correct cell value at valid position', () => {
        expect(cellAtPos(board, 2, 1)).toBe(5);
    });

    test('returns cell value with wrapped coordinates', () => {
        expect(cellAtPos(board, -1, 0)).toBe(2);
        expect(cellAtPos(board, 0, 3)).toBe(0);
    });
});

describe('map2D', () => {

    it('Should properly map a 2D array', () => {
        const dict = [
            [0, 1, 2],
            [3, 4, 5],
        ]

        const expected = [
            [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 } ],
            [ { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 } ],
        ]

        const res = map2D(dict, (cell, x, y) => ({ x, y }))

        expect(res).toEqual(expected)
    })

})
