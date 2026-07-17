import { useCallback, useRef, useState } from 'react';
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

      const userId = ++idRef.current;
      const assistantId = ++idRef.current;
      setMessages((previous) => [
        ...previous,
        { id: userId, role: 'user', text: question },
        { id: assistantId, role: 'assistant', text: '' },
      ]);

      const history = buildMessages(initialMessages, messages, question);
      try {
        await streamChat(history, {
          onDelta: (chunk) =>
            setMessages((previous) =>
              previous.map((message) =>
                message.id === assistantId ? { ...message, text: message.text + chunk } : message,
              ),
            ),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId ? { ...message, text: `_Something went wrong: ${errorMessage}_` } : message,
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
