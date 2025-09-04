import {xyFromIndex} from "./utils";

export type Square = {
    alive: boolean;
    ticks: 0
}

export type BoardState = {
    width: number;
    height: number;
    squares: Square[];
}

export function randomBoard(width: number, height: number): BoardState {
    return newBoard(width, height, () => Math.random() > 0.5);
}

export function newBoard(width: number, height: number, isAlive = (x: number,y :number) => false): BoardState {
    const sqForIndex = (_, i: number): Square => {
        const { x, y } = xyFromIndex(i, width, height);
        return {
            ticks: 0,
            alive: isAlive(x, y)
        }
    }
    
    return {
        width, height,
        squares: new Array(height * width).fill(null).map(sqForIndex)
    }
}
