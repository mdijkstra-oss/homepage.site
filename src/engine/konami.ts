const KONAMI_SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

export function installKonami(onComplete: () => void): () => void {
  let i = 0;
  const onKey = (e: KeyboardEvent) => {
    const key = (e.key || '').toLowerCase();
    if (key === KONAMI_SEQUENCE[i]) {
      i++;
      if (i === KONAMI_SEQUENCE.length) { i = 0; onComplete(); }
    } else {
      i = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
