import {Board} from "./board";

export const glider: Board = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
];

export const blinker: Board = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
];

export const toad: Board = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
];

export const pulsar: Board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

export const beacon: Board = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
];

export const lightweightSpaceship: Board = [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
];

export const pentadecathlon: Board = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const block: Board = [
    [1, 1],
    [1, 1],
];

export const beehive: Board = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
];

export const loaf: Board = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
];
