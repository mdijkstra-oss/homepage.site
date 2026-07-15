import type { ReactNode } from 'react';

export function Row({ end, children }: { end?: boolean; children: ReactNode }) {
  return <div style={{ display: 'flex', justifyContent: end ? 'flex-end' : 'flex-start' }}>{children}</div>;
}
