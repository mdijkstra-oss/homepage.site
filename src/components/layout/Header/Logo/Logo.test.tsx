// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SITE } from '../../../../content/site';
import Logo from './Logo';

describe('Logo', () => {
  afterEach(cleanup);

  it('links to the site root', () => {
    render(<Logo />);

    expect(screen.getByRole('link', { name: SITE.logo }).getAttribute('href')).toBe('/');
  });
});
