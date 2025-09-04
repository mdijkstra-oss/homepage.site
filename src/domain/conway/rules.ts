import {BoardState, Square} from "./board";
import {cellAtPos, xyFromIndex} from "./utils";

export function tickBoard(board: BoardState): BoardState {
    const boardStateTicker = (square: Square, index: number) => nextState(board, square, index);

    return {
        ...board,
        squares: board.squares.map(boardStateTicker)
    }
}

function nextState(board: BoardState, square: Square, index: number): Square {
    const { x, y } = xyFromIndex(index, board.width, board.height);
    const neighbours = countNeighbours(board, x, y);
    const alive = willBeAlive(square, neighbours)

    return {
        ...square,
        alive
    }
}

function countNeighbours(board: BoardState, x: number, y: number, include: (square: Square) => boolean = (sq) => sq.alive): number {
    const offsets = [-1, 0, 1];
    let count = 0;

    for (const yOffset of offsets) {
        for (const xOffset of offsets) {
            if (xOffset === 0 && yOffset === 0) continue;
            const newX = x + xOffset;
            const newY = y + yOffset;
            const cell = cellAtPos(board.squares, board.width, board.height, newX, newY);
            if (cell && include(cell)) {
                count++;
            }
        }
    }

    return count;
}


function willBeAlive(square: Square, neighbours: number) {
    if (neighbours === 3) return true;
    if (neighbours === 2) return square.alive;
    return false;
}

