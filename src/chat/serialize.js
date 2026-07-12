// Turn a content block's payload into readable text so it can be sent to the
// LLM as prior conversation context. Generic on purpose: it walks whatever
// shape a card payload has, so new card types need no changes here.

function flatten(value, depth = 0) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value
      .map((v) => flatten(v, depth))
      .filter(Boolean)
      .join('\n');
  }
  if (typeof value === 'object') {
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

// A single preloaded block -> the assistant-turn text that represents it.
export function blockToText(block) {
  const body = flatten(block.payload ?? block.text ?? '');
  return `[${block.type}]\n${body}`;
}
