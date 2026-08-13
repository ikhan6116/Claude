# 🐕 MyKobe — pet-care app, guided by MEGHAN

**MyKobe** is the pet-care app; **MEGHAN** is the AI veterinary companion inside it —
written to feel like the friend who became your vet. She runs a quick pet-profile
intake (name/breed/age/weight/history), gives **breed-aware, preventive** guidance,
evidence-based advice plus an honest **"Real Talk"** read on products/supplements
(including emerging options like peptides), and points users to the rest of the app
(community, resources, rescues, pet-friendly places, and the social feed).

Brand names live in `src/lib/meghan/brand.ts` (`APP_NAME`, `BOT_NAME`).

> ⚠️ MEGHAN is an AI assistant, **not** a licensed veterinarian and not a
> substitute for a hands-on exam. She is built to escalate real emergencies to an
> in-person / emergency vet rather than try to handle them.

## Try it

- **App / chat UI:** `/meghan`
- **Feature sections:** `/meghan/community`, `/meghan/resources`, `/meghan/rescues`, `/meghan/places` (pet-friendly map), `/meghan/petstagram` (with live-camera pet verification)
- **Chat API:** `POST /api/meghan/chat`
- **Health/config check:** `GET /api/meghan/health` — reports whether the API key
  is detected (never exposes it), e.g. `{ "configured": true, "mode": "live", "model": "claude-sonnet-5" }`.
  Use it to confirm env-var setup in each environment.

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev                   # visit http://localhost:3000/meghan
```

Without `ANTHROPIC_API_KEY`, MEGHAN runs in **demo mode**: the UI is fully
functional and returns a friendly in-persona placeholder instead of a live answer,
so you can develop the front end without a key.

## Configuration

| Env var             | Required | Default           | Purpose                                  |
| ------------------- | -------- | ----------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY` | for live | —                 | Powers MEGHAN's chat via the Claude API. |
| `MEGHAN_MODEL`      | no       | `claude-sonnet-5` | Override the Claude model used.          |

## Architecture

```
src/
├── lib/meghan/
│   ├── types.ts          # Shared types (ChatMessage, AppFeature, EmergencyScan)
│   ├── appFeatures.ts    # Single source of truth for the app's feature sections
│   ├── systemPrompt.ts   # MEGHAN's persona, guardrails & the "Real Talk" rules
│   ├── emergency.ts      # Keyword/phrase emergency triage detection
│   └── anthropic.ts      # Minimal Claude Messages API client (fetch + SSE)
├── pages/
│   ├── api/meghan/chat.ts# Streaming chat endpoint (validation, emergency, demo)
│   └── meghan/
│       ├── index.tsx     # Landing hero + embedded chat + feature cards
│       ├── community.tsx  resources.tsx  rescues.tsx  petstagram.tsx
└── components/meghan/
    ├── MeghanShell.tsx   # Shared header/nav/footer (with global disclaimer)
    ├── MeghanChat.tsx    # Chat UI: streaming, emergency banner, suggestions
    ├── Markdown.tsx      # Safe, dependency-free markdown renderer
    └── FeaturePage.tsx   # Shared layout for the feature sections
```

### How a message flows

1. The browser POSTs the transcript to `/api/meghan/chat`.
2. The server validates the transcript and runs `scanForEmergency()` on the latest
   user turn. The result is returned in the `X-Meghan-Emergency` response header so
   the UI can show a prominent red banner **instantly**, before any tokens stream.
3. The system prompt is assembled from `MEGHAN_SYSTEM_PROMPT` (+ an
   `EMERGENCY_DIRECTIVE` override when a trigger fires, forcing MEGHAN to lead with
   the warning).
4. The Claude Messages API is called with `stream: true`; text deltas are parsed
   from the SSE stream and forwarded to the browser as a plain-text stream for a
   live typing effect.

### Emergency triage (safety net)

`emergency.ts` deliberately errs toward caution — a false positive just makes
MEGHAN lead with "please get seen urgently," which is a safe failure mode. Word
boundaries prevent obvious false positives (e.g. "bloodwork" does not trip the
`blood` keyword). The model still performs the real, nuanced triage; this detector
only guarantees the warning is never buried under product talk.

### The "Real Talk" feature & honesty

MEGHAN gives the veterinary-evidence view first, then a clearly-labeled summary of
general community/forum sentiment. She is instructed **not** to fabricate quotes,
usernames, or vote counts, and to be transparent that she is summarizing general
sentiment from training knowledge — not live-scraping Reddit — and to route users
to the in-app **Product Experiences** group for current firsthand accounts.

## Extending

- **Live community consensus (RAG):** to make "Real Talk" reflect *current*
  sentiment, add a retrieval step before the model call in `api/meghan/chat.ts`
  (search API or a scraped-review store), and inject the retrieved snippets into
  the system/context. The prompt is already written to prefer grounded sources over
  guessing.
- **New app sections:** add an entry to `APP_FEATURES` in `appFeatures.ts`. It
  automatically appears in the nav, footer, home cards, and MEGHAN's cross-promotion
  instructions — keeping the assistant from ever referencing a section that doesn't
  exist.
