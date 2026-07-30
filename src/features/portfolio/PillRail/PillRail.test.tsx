// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SECTIONS } from '../../../content/site';
import { selectPromptPills } from '../model/promptPills';
import PillRail from './PillRail';

describe('PillRail', () => {
  afterEach(cleanup);

  it.each(selectPromptPills(SECTIONS))('links $label to its $section section', ({ label, section }) => {
    render(<PillRail />);
    expect(screen.getByRole('link', { name: label }).getAttribute('href')).toBe(`#${section}`);
  });
});
