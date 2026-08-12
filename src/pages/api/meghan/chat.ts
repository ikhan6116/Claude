import type { NextApiRequest, NextApiResponse } from 'next';
import { AnthropicClient, AnthropicApiError } from '../../../lib/meghan/anthropic';
import { MEGHAN_SYSTEM_PROMPT, EMERGENCY_DIRECTIVE } from '../../../lib/meghan/systemPrompt';
import { scanForEmergency, EMERGENCY_BANNER } from '../../../lib/meghan/emergency';
import type { ChatMessage, ChatRole } from '../../../lib/meghan/types';

export const config = {
  api: {
    // Streaming responses can exceed the default 4MB soft limit warning.
    responseLimit: false,
  },
};

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 24000;

function isRole(v: unknown): v is ChatRole {
  return v === 'user' || v === 'assistant';
}

/**
 * Validate and normalize the incoming conversation. Anthropic requires the
 * transcript to start with a user turn and alternate, so we drop any leading
 * assistant messages the client may have sent.
 */
function parseMessages(body: unknown): { messages: ChatMessage[] } | { error: string } {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: 'Request must include a non-empty "messages" array.' };
  }
  if (raw.length > MAX_MESSAGES) {
    return { error: `Conversation too long (max ${MAX_MESSAGES} messages).` };
  }

  let total = 0;
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    const role = (item as { role?: unknown })?.role;
    const content = (item as { content?: unknown })?.content;
    if (!isRole(role) || typeof content !== 'string') {
      return { error: 'Each message needs a valid role ("user" | "assistant") and string content.' };
    }
    const trimmed = content.trim();
    if (trimmed.length === 0) continue;
    if (trimmed.length > MAX_MESSAGE_CHARS) {
      return { error: `Each message must be under ${MAX_MESSAGE_CHARS} characters.` };
    }
    total += trimmed.length;
    messages.push({ role, content: trimmed });
  }

  if (total > MAX_TOTAL_CHARS) {
    return { error: 'Conversation is too large. Please start a new chat.' };
  }

  // Drop any leading assistant turns so the transcript begins with the user.
  while (messages.length > 0 && messages[0].role === 'assistant') {
    messages.shift();
  }
  if (messages.length === 0) {
    return { error: 'Conversation must contain at least one user message.' };
  }
  if (messages[messages.length - 1].role !== 'user') {
    return { error: 'The most recent message must be from the user.' };
  }

  return { messages };
}

/** In-persona response used when the live model isn't connected (no API key). */
function demoFallback(isEmergency: boolean): string {
  const emergencyLead = isEmergency
    ? `**⚠️ THIS MAY BE AN EMERGENCY.** ${EMERGENCY_BANNER.body}\n\n---\n\n`
    : '';
  return (
    emergencyLead +
    `Hi, I'm **MEGHAN**, your AI vet companion. 🐾\n\n` +
    `I'm not fully connected to my knowledge engine right now — this app needs an ` +
    `\`ANTHROPIC_API_KEY\` configured on the server before I can chat live. Once that's set, ` +
    `I can help you triage symptoms, give you the real "Real Talk" on products and supplements, ` +
    `and point you to the right corner of the app.\n\n` +
    `In the meantime: if your pet is showing any severe symptoms — trouble breathing, non-stop ` +
    `bleeding, seizures, collapse, or a suspected poisoning — please contact your nearest ` +
    `**emergency vet** right away, or call the **ASPCA Animal Poison Control Center at (888) 426-4435**.\n\n` +
    `_I'm an AI assistant, not a substitute for a hands-on exam by a licensed veterinarian._`
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseMessages(req.body);
  if ('error' in parsed) {
    return res.status(400).json({ error: parsed.error });
  }
  const { messages } = parsed;

  // Server-authoritative emergency detection on the latest user turn.
  const latestUser = messages[messages.length - 1];
  const scan = scanForEmergency(latestUser.content);
  res.setHeader('X-Meghan-Emergency', scan.isEmergency ? '1' : '0');

  const client = new AnthropicClient();

  // Common streaming headers.
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  // Demo mode: no key configured — still return something useful.
  if (!client.isConfigured) {
    return res.status(200).end(demoFallback(scan.isEmergency));
  }

  const system = scan.isEmergency
    ? `${MEGHAN_SYSTEM_PROMPT}\n\n${EMERGENCY_DIRECTIVE}`
    : MEGHAN_SYSTEM_PROMPT;

  let wroteAny = false;
  try {
    for await (const chunk of client.streamText({ system, messages })) {
      if (!chunk) continue;
      wroteAny = true;
      res.write(chunk);
      // Flush through any compression middleware for a live typing effect.
      (res as unknown as { flush?: () => void }).flush?.();
    }
    return res.end();
  } catch (err) {
    const message =
      err instanceof AnthropicApiError
        ? err.message
        : 'Something went wrong reaching the assistant.';
    console.error('[meghan/chat] stream error:', err);

    if (!wroteAny && !res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(502).end(JSON.stringify({ error: message }));
    }
    // Already mid-stream: append a graceful, in-voice notice.
    res.write(`\n\n_(Sorry — I hit a technical hiccup and couldn't finish that thought. Please try again.)_`);
    return res.end();
  }
}
