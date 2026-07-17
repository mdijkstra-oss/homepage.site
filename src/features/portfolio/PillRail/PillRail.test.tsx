// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PillRail from './PillRail';

describe('PillRail', () => {
  afterEach(cleanup);

  it.each([
    { label: 'Profile', href: '#profile' },
    { label: 'Experience', href: '#experience' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Approach', href: '#approach' },
    { label: 'Education', href: '#education' },
  ])('links $label to $href', ({ label, href }) => {
    render(<PillRail />);
    expect(screen.getByRole('link', { name: label }).getAttribute('href')).toBe(href);
  });
});
