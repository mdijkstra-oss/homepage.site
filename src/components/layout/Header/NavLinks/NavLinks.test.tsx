// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import NavLinks from './NavLinks';

describe('NavLinks', () => {
  afterEach(cleanup);

  it.each([
    ['LinkedIn', 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/'],
    ['Resume', '/resume.pdf'],
    ['Contact', "mailto:hire@mdijkstra.dev?subject=Let's%20build%20something"],
  ] as const)('renders the %s entry with its destination', (label, href) => {
    render(<NavLinks />);
    const entry = screen.getByText(label);

    expect(entry.getAttribute('href')).toBe(href);
  });
});
