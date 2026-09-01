import { useCallback, useRef, useState } from 'react';
import { streamChat } from '../api/client';
import { buildMessages } from '../conversation/history';
import type { ChatMessage, ChatTurn } from '../conversation/messages';

// Typing one of these in the chat fails on purpose, to confirm a browser error
// reaches the error tracker. Thrown from a timeout so it escapes this handler and
// React's error boundary and arrives as the unhandled error the tag listens for —
// caught inside the send path it would never leave the page.
const ERROR_TRIGGERS: Record<string, () => void> = {
  '/throw': () => {
    throw new Error('Deliberate test error: uncaught exception from the chat box');
  },
  '/reject': () => {
    void Promise.reject(new Error('Deliberate test error: unhandled promise rejection'));
  },
};

export function useLLMChat(initialMessages: readonly ChatMessage[]) {
  const idRef = useRef(0);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const sendMessage = useCallback(
    async function sendMessage(text: string) {
      const question = text.trim();
      if (!question || isGeneratingResponse) return;

      const trigger = ERROR_TRIGGERS[question.toLowerCase()];
      if (trigger) {
        const noticeId = ++idRef.current;
        setMessages((previous) => [
          ...previous,
          { id: noticeId, role: 'assistant', text: `Threw \`${question}\`. It should appear in Better Stack shortly.` },
        ]);
        setTimeout(trigger, 0);
        return;
      }

      setIsGeneratingResponse(true);

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
            pending += chunk;
            if (!flushHandle) flushHandle = requestAnimationFrame(flush);
          },
        });
        settle();
      } catch (error) {
        settle();
        const errorMessage = error instanceof Error ? error.message : String(error);
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

function withFailureMarker(streamed: string, errorMessage: string): string {
  const marker = `_Something went wrong: ${errorMessage}_`;
  return streamed ? `${streamed}\n\n${marker}` : marker;
}
