export function smoothstep(p: number): number {
  return p * p * (3 - 2 * p);
}

export function smootherstep(p: number): number {
  return p * p * p * (p * (p * 6 - 15) + 10);
}
