// https://en.wikipedia.org/wiki/Linear_congruential_generator

export type RNG = {
    random: () => number;
    intInRange: (min: number, max: number) => number;
};

type SeedSource = number | (() => number);

export const createRNG = (seed: SeedSource = Math.random): RNG => {
    let currentSeed = typeof seed === 'function' ? seed() : seed;

    const random = (): number => {
        if (currentSeed === 0) currentSeed = 2147483647;
        currentSeed = (currentSeed * 16807) % 2147483647;
        return (currentSeed - 1) / 2147483646;
    };

    const intInRange = (min: number, max: number): number =>
        Math.floor(min + random() * (max - min + 1));

    return { random, intInRange };
};

export const randomSeed = (): number => Math.floor(Math.random() * 2147483647);