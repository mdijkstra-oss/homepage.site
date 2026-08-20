import { useCallback, useRef, useState } from 'react';
import { capture } from '../../../lib/analytics';
import { streamChat } from '../api/client';
import { buildMessages } from '../conversation/history';
import type { ChatMessage, ChatTurn } from '../conversation/messages';

export function useLLMChat(initialMessages: readonly ChatMessage[]) {
  const idRef = useRef(0);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const sendMessage = useCallback(
    async function sendMessage(text: string) {
      const question = text.trim();
      if (!question || isGeneratingResponse) return;
      setIsGeneratingResponse(true);

      const turn = countQuestions(messages) + 1;
      const startedAt = performance.now();
      capture('asked question', { question, turn });

      const userId = ++idRef.current;
      const assistantId = ++idRef.current;
      setMessages((previous) => [
        ...previous,
        { id: userId, role: 'user', text: question },
        { id: assistantId, role: 'assistant', text: '' },
      ]);

      const history = buildMessages(initialMessages, messages, question);

      // Deltas arrive far faster than the eye reads; committing each one re-renders
      // the page and re-parses the whole answer as markdown. Batch them per frame.
      let answer = '';
      let pending = '';
      let flushHandle = 0;
      const flush = () => {
        flushHandle = 0;
        if (!pending) return;
        const chunk = pending;
        pending = '';
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId ? { ...message, text: message.text + chunk } : message,
          ),
        );
      };
      const settle = () => {
        if (flushHandle) cancelAnimationFrame(flushHandle);
        flush();
      };

      try {
        await streamChat(history, {
          onDelta: (chunk) => {
            answer += chunk;
            pending += chunk;
            if (!flushHandle) flushHandle = requestAnimationFrame(flush);
          },
        });
        settle();
        captureAnswer({ question, turn, answer, startedAt });
      } catch (error) {
        settle();
        const errorMessage = error instanceof Error ? error.message : String(error);
        captureAnswer({ question, turn, answer, startedAt, error: errorMessage });
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId ? { ...message, text: withFailureMarker(message.text, errorMessage) } : message,
          ),
        );
      } finally {
        setIsGeneratingResponse(false);
      }
    },
    [initialMessages, isGeneratingResponse, messages],
  );

  return { messages, isGeneratingResponse, sendMessage };
}

function countQuestions(turns: readonly ChatTurn[]): number {
  return turns.filter((turn) => turn.role === 'user').length;
}

interface AnsweredQuestion {
  question: string;
  turn: number;
  answer: string;
  startedAt: number;
  error?: string;
}

function captureAnswer({ question, turn, answer, startedAt, error }: AnsweredQuestion): void {
  capture('received answer', {
    question,
    turn,
    answer,
    ms: Math.round(performance.now() - startedAt),
    error: error ?? null,
  });
}

function withFailureMarker(streamed: string, errorMessage: string): string {
  const marker = `_Something went wrong: ${errorMessage}_`;
  return streamed ? `${streamed}\n\n${marker}` : marker;
}
