import type { BlockType } from '../data/blocks';

export function selectNavigationIndex(blockOrder: readonly BlockType[], type: BlockType): number {
  const targetIndex = blockOrder.indexOf(type);
  if (targetIndex <= 0) return 0;
  return blockOrder[targetIndex - 1] === 'user' ? targetIndex - 1 : targetIndex;
}
