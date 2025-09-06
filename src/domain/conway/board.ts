import {createRNG, randomSeed, RNG} from "@/utils/rand";
import {averageSize, STAMPS, stamp, canFit} from "./stamp";
import {padGrid} from "@/domain/conway/utils";

export type Cell = 0 | 1;
export type Board = Cell[][]

const STAMP_TRY_COUNT = 20 as const

export function randomBoard(width: number, height: number): Board {
    return seededBoard(width, height, randomSeed()).board;
}

export function newBoard(width: number, height: number, cellState = (x: number,y :number): Cell => 0): Board {
    return Array(height).fill(0).map((_, y) => Array(width).fill(0).map((_, x) => cellState(x,y)));
}

export function seededBoard(width: number, height: number, seed: number): { board: Board, seed: number } {
    const rng = createRNG(seed);

    const stampDensity = rng.random()
    const stamps = randomStampsForSpace(width, height, stampDensity, rng)

    let board = newBoard(width, height)


    for (const currentStamp of stamps) {
        for (let i = 0; i < STAMP_TRY_COUNT; i++) {
            const x = rng.intInRange(0, width)
            const y = rng.intInRange(0, height)

            const fits = canFit(board, currentStamp, x, y)
            if (!fits) continue

            board = stamp(board, currentStamp, x, y)
            break;
        }
    }

    return { board, seed }
}

function randomStampsForSpace(width: number, height: number, density: number, rng: RNG, allStamps = STAMPS) {
    const averageStampSize = averageSize(allStamps)
    const targetSize = width * height

    const stampsToTry = Math.floor(targetSize / averageStampSize * density)


    return Array(stampsToTry).fill(0).map(() => allStamps[rng.intInRange(0, allStamps.length - 1)])
}