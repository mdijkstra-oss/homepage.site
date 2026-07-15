import type { Block } from '../data/blocks';
import { isRecord } from '../lib/json';

function flattenUnknownRecord(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value.map(flattenUnknownRecord).filter(Boolean).join('\n');
  }
  if (isRecord(value)) {
    return Object.entries(value)
      .map(([k, v]) => {
        const inner = flattenUnknownRecord(v);
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
  const body = flattenUnknownRecord(payload ?? text ?? '');
  return `[${block.type}]\n${body}`;
}
