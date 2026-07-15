import type { Block } from '../types/blocks';

function flatten(value: unknown, depth = 0): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value
      .map(flatten)
      .filter(Boolean)
      .join('\n');
  }
  if (isRecord(value)) {
    return Object.entries(value)
      .map(([k, v]) => {
        const inner = flatten(v, depth + 1);
        if (!inner) return '';
        return inner.includes('\n') ? `${k}:\n${inner}` : `${k}: ${inner}`;
      })
      .filter(Boolean)
      .join('\n');
  }
  return '';
}

export function blockToConversationText(block: Block): string {
  const payload = 'payload' in block ? block.payload : undefined;
  const text = 'text' in block ? block.text : undefined;
  const body = flatten(payload ?? text ?? '');
  return `[${block.type}]\n${body}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
