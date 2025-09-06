import {Board, Cell} from "./board";
import {cellAtPos, map2D} from "./utils";

export function tickBoard(board: Board): Board {
    const boardStateTicker = (cell: Cell, x: number, y: number) => nextState(board, cell, x, y);
    return map2D(board, boardStateTicker)
}

function nextState(board: Board, cell: Cell, x: number, y: number): Cell {
    const neighbours = countNeighbours(board, x, y);
    const alive = willBeAlive(cell, neighbours)
    return alive ? 1 : 0
}

function countNeighbours(board: Board, x: number, y: number, filter: (square: Cell) => boolean = (cell) => !!cell): number {
    const offsets = [-1, 0, 1];
    let count = 0;

    for (const yOffset of offsets) {
        for (const xOffset of offsets) {
            if (xOffset === 0 && yOffset === 0) continue;
            const newX = x + xOffset;
            const newY = y + yOffset;
            const cell = cellAtPos(board, newX, newY);
            if (cell && filter(cell)) {
                count++;
            }
        }
    }

    return count;
}

function willBeAlive(cell: Cell, neighbours: number): Boolean {
    if (neighbours === 3) return true;
    if (neighbours === 2) return !!cell;
    return false;
}

