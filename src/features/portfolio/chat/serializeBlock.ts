import { isRecord } from '../../../lib/json';
import type { CardBlock } from '../model/types';

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

export function blockToConversationText(block: CardBlock): string {
  const body = flattenUnknownRecord(block.payload);
  return `[${block.type}]\n${body}`;
}
