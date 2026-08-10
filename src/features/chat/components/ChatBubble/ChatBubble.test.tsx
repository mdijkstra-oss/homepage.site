// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SITE } from '../../../../content/site';
import ChatBubble from './ChatBubble';

const STEP_MS = 2500;
const [first, second] = SITE.thinkingWords;
const last = SITE.thinkingWords[SITE.thinkingWords.length - 1];

function advance(steps: number) {
  act(() => {
    vi.advanceTimersByTime(STEP_MS * steps);
  });
}

describe('ChatBubble', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('opens the wait on the first word', () => {
    render(<ChatBubble speaker="assistant" text="" />);
    expect(screen.getByText(`${first}…`)).toBeDefined();
  });

  it('moves to the next word as the wait goes on', () => {
    render(<ChatBubble speaker="assistant" text="" />);
    advance(1);
    expect(screen.getByText(`${second}…`)).toBeDefined();
  });

  it('settles on the last word rather than looping back', () => {
    render(<ChatBubble speaker="assistant" text="" />);
    advance(SITE.thinkingWords.length + 5);
    expect(screen.getByText(`${last}…`)).toBeDefined();
  });

  it('shows the answer instead of a word once text arrives', () => {
    render(<ChatBubble speaker="assistant" text="Hello there" />);
    advance(2);
    expect(screen.getByText('Hello there')).toBeDefined();
    expect(screen.queryByText(`${first}…`)).toBeNull();
  });

  it('never makes a user turn wait', () => {
    render(<ChatBubble speaker="user" text="" />);
    expect(screen.queryByText(`${first}…`)).toBeNull();
  });
});
