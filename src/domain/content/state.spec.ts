import { describe, it, expect } from 'vitest';
import {ContentAction, reduceContentUpdate} from './state';
import { makePrompt, Prompt } from './prompt';

function testActions(actions: ContentAction[], expectedPrompts: Prompt[]): void {
  let state: Prompt[] = [];

  actions.forEach(action => {
    state = reduceContentUpdate(action, state);
  });

  const actualStateObj = comparableStateObj(state);
  const expectedStateObj = comparableStateObj(expectedPrompts);

  expect(actualStateObj).toEqual(expectedStateObj);
}

function comparableStateObj(prompts: Prompt[]): any[] {
  return prompts.map(prompt => ({
    ...prompt,
    replies: Object.fromEntries(prompt.replies)
  }));
}

describe('reduceContentUpdate', () => {

  it('Should handle a sequence of prompt and reply actions sequentially to reduce to proper content state', () => {
    const promptId1 = 'prompt-1';
    const promptId2 = 'prompt-2';

    const actions: ContentAction[] = [
      // Add first prompt
      {
        type: 'ADD_PROMPT',
        payload: makePrompt('What is your favorite food?', [], promptId1)
      },

      // Add second prompt
      {
        type: 'ADD_PROMPT',
        payload: makePrompt('What is your favorite movie?', [], promptId2)
      },

      // Add reply to first prompt
      {
        type: 'CREATE',
        payload: {
          id: 'reply-1',
          promptId: promptId1,
          title: 'Pizza',
          content: 'I love pizza!',
          meta: {
            date: new Date('2023-01-01')
          }
        }
      },

      // Add reply to second prompt
      {
        type: 'CREATE',
        payload: {
          id: 'reply-2',
          promptId: promptId2,
          title: 'Inception',
          content: 'Inception is my favorite movie.',
          meta: {
            date: new Date('2023-01-02')
          }
        }
      },

      // Update reply to first prompt
      {
        type: 'MERGE',
        payload: {
          id: 'reply-1',
          promptId: promptId1,
          title: 'Italian Pizza'
        }
      }
    ];

    // Expected final state
    const expectedPrompts: Prompt[] = [
      {
        id: promptId1,
        message: 'What is your favorite food?',
        replies: new Map([
          ['reply-1', {
            id: 'reply-1',
            promptId: promptId1,
            title: 'Italian Pizza',
            content: 'I love pizza!',
            meta: {
              date: new Date('2023-01-01')
            }
          }]
        ])
      },
      {
        id: promptId2,
        message: 'What is your favorite movie?',
        replies: new Map([
          ['reply-2', {
            id: 'reply-2',
            promptId: promptId2,
            title: 'Inception',
            content: 'Inception is my favorite movie.',
            meta: {
              date: new Date('2023-01-02')
            }
          }]
        ])
      }
    ];

    // Test actions against expected state
    testActions(actions, expectedPrompts);
  });
});
