import { vi } from 'vitest';

export interface FetchCall {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

export interface OpenSseResponse {
  response: Response;
  push: (chunk: string) => void;
  close: () => void;
}

export function sseDelta(text: string): string {
  return `event: response.output_text.delta\ndata: {"delta":${JSON.stringify(text)}}\n\n`;
}

export function sseFailed(message: string): string {
  return `event: response.failed\ndata: {"response":{"error":{"message":${JSON.stringify(message)}}}}\n\n`;
}

export const SSE_COMPLETED = 'event: response.completed\ndata: {"type":"response.completed"}\n\n';

export function sseResponse(chunks: readonly string[], status = 200): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(stream, { status });
}

export function openSseResponse(): OpenSseResponse {
  const encoder = new TextEncoder();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({
    start(streamController) {
      controller = streamController;
    },
  });
  return {
    response: new Response(stream, { status: 200 }),
    push: (chunk) => controller.enqueue(encoder.encode(chunk)),
    close: () => controller.close(),
  };
}

export function stubFetch(respond: () => Promise<Response>): FetchCall[] {
  const calls: FetchCall[] = [];
  vi.stubGlobal('fetch', (url: string, init: RequestInit) => {
    calls.push({
      url,
      headers: { ...(init.headers as Record<string, string>) },
      body: JSON.parse(String(init.body)) as Record<string, unknown>,
    });
    return respond();
  });
  return calls;
}
