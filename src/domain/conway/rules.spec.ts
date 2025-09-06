import {tickBoard} from "./rules";
import {padGrid} from "./utils";
import {Board} from './board'

const pad = (grid: Board) => padGrid(grid, 0)

describe('Conway game of life rules', () => {

    function testBoard(board: Board, compares: Board[]) {

        let currentBoard = pad(board)

        for (const i of compares.keys()) {
            currentBoard = tickBoard(currentBoard)

            const compare = pad(compares[i])

            expect(currentBoard).toEqual(compare)
        }

    }

    it('should correctly evolve for a grid with a blinker pattern', () => {
        const blinker: Board = [
            [0,1,0],
            [0,1,0],
            [0,1,0]
        ]

        const blinkerNextStep: Board = [
            [0,0,0],
            [1,1,1],
            [0,0,0]
        ]

        testBoard(blinker, [blinkerNextStep, blinker]);
    });

    it('should handle a still life block pattern', () => {
        const block: Board = [
            [1,1],
            [1,1]
        ];

        testBoard(block, [block]);
    });

    it('should correctly evolve for a toad pattern', () => {

        const toad: Board = [
            [0,0,0,0,],
            [0,1,1,1,],
            [1,1,1,0,],
            [0,0,0,0,],
        ];

        const toadNextStep: Board = [
            [0,0,1,0,],
            [1,0,0,1,],
            [1,0,0,1,],
            [0,1,0,0,],
        ];

        testBoard(toad, [toadNextStep, toad]);
    });

    it('should correctly evolve for a single live cell', () => {
        const singleCell: Board = [[1]];
        const empty: Board = [[0]];

        testBoard(singleCell, [empty]);
    });

})