// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import NavLinks from './NavLinks';

describe('NavLinks', () => {
  afterEach(cleanup);

  it.each([
    ['LinkedIn', 'linkedin', 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/'],
    ['Resume', 'resume', null],
    ['Contact', 'contact', "mailto:hire@mdijkstra.dev?subject=Let's%20build%20something"],
  ] as const)('renders the %s entry with its icon and destination', (label, icon, href) => {
    render(<NavLinks />);
    const entry = screen.getByText(label).parentElement;

    expect(entry?.querySelector(`[data-icon="${icon}"]`)).not.toBeNull();
    expect(entry?.getAttribute('href')).toBe(href);
  });
});
