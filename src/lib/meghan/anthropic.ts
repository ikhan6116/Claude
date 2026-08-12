/**
 * Minimal Anthropic (Claude) Messages API client.
 *
 * Uses fetch + SSE directly so we don't pull in the SDK. Exposes a streaming
 * generator that yields text deltas, which the chat API route forwards to the
 * browser for a live typing effect.
 *
 * Docs: https://docs.anthropic.com/en/api/messages
 */

import type { ChatMessage } from './types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

/** Default model — configurable via MEGHAN_MODEL. */
const DEFAULT_MODEL = 'claude-sonnet-5';

export class AnthropicApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody?: unknown
  ) {
    super(message);
    this.name = 'AnthropicApiError';
  }
}

export interface StreamOptions {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
  signal?: AbortSignal;
}

export class AnthropicClient {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey ?? process.env.ANTHROPIC_API_KEY ?? '';
    this.model = model ?? process.env.MEGHAN_MODEL ?? DEFAULT_MODEL;
  }

  /** Whether an API key is configured. */
  get isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Stream a completion, yielding text chunks as they arrive.
   * Throws AnthropicApiError on a non-2xx response or an API-level error event.
   */
  async *streamText(opts: StreamOptions): AsyncGenerator<string, void, unknown> {
    if (!this.isConfigured) {
      throw new AnthropicApiError('ANTHROPIC_API_KEY is not configured', 500);
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: opts.model ?? this.model,
        // Roomy enough for MEGHAN's multi-section replies without runaway cost.
        max_tokens: opts.maxTokens ?? 1500,
        temperature: opts.temperature ?? 0.6,
        system: opts.system,
        stream: true,
        messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
      signal: opts.signal,
    });

    if (!response.ok || !response.body) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text().catch(() => undefined);
      }
      const detail =
        (body as { error?: { message?: string } })?.error?.message ??
        `Anthropic API request failed (${response.status})`;
      throw new AnthropicApiError(detail, response.status, body);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by a blank line. Process complete events and
        // keep any trailing partial event in the buffer.
        let sepIndex: number;
        while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);
          const chunk = this.parseEvent(rawEvent);
          if (chunk) yield chunk;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /** Parse one SSE event block; return text delta if present. */
  private parseEvent(rawEvent: string): string | null {
    const dataLines = rawEvent
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim());

    if (dataLines.length === 0) return null;
    const data = dataLines.join('');
    if (data === '[DONE]') return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return null;
    }

    const evt = parsed as {
      type?: string;
      delta?: { type?: string; text?: string };
      error?: { message?: string; type?: string };
    };

    if (evt.type === 'error') {
      throw new AnthropicApiError(
        evt.error?.message ?? 'Anthropic streaming error',
        502,
        evt.error
      );
    }

    if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
      return evt.delta.text ?? '';
    }

    return null;
  }
}
