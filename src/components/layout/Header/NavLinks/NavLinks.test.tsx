// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SITE } from '../../../../content/site';
import NavLinks from './NavLinks';

describe('NavLinks', () => {
  afterEach(cleanup);

  it.each(SITE.nav)('renders the $label entry with its destination', (item) => {
    render(<NavLinks />);
    const entry = screen.getByText(item.label);

    expect(entry.getAttribute('href')).toBe(item.href ?? null);
  });
});
