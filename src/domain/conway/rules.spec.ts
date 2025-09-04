import {BoardState, newBoard, randomBoard} from "./board";
import {tickBoard} from "./rules";
import {delay} from "@/utils/async";

type Grid = (0 | 1)[][]

function boardFromGrid(grid: Grid): BoardState {
    const h = grid.length;
    const w = grid[0].length;
    return newBoard(w, h, (x, y) => !!grid[y][x]);
}

describe('Conway game of life rules', () => {

    function testGrid(grid: Grid, compares: Grid[]) {

        let currentBoard = boardFromGrid(grid)

        for (const i of compares.keys()) {
            currentBoard = tickBoard(currentBoard)

            const compare = boardFromGrid(compares[i])

            expect(currentBoard).toEqual(compare)
        }

    }

    it('should correctly evolve for a grid with a blinker pattern', () => {
        const blinker: Grid = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        const blinkerNextStep: Grid = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        testGrid(blinker, [blinkerNextStep, blinker]);
    });

    it('should handle a still life block pattern', () => {
        const block: Grid = [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ];

        testGrid(block, [block]);
    });

    it('should correctly evolve for a toad pattern', () => {

        const toad: Grid = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];

        const toadNextStep: Grid = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];

        testGrid(toad, [toadNextStep, toad]);
    });

    it('should correctly evolve for an empty grid', () => {
        const empty: Grid = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        testGrid(empty, [empty]);
    });

    it('should correctly evolve for a single live cell', () => {
        const singleCell: Grid = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ];

        const empty: Grid = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        testGrid(singleCell, [empty]);
    });

})