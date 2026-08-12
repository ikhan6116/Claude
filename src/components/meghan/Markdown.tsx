import React, { Fragment, ReactNode } from 'react';

/**
 * Tiny, dependency-free markdown renderer for MEGHAN's chat replies.
 *
 * It handles exactly what MEGHAN produces — bold, italic, inline code, links,
 * headings, bullet/numbered lists, blockquotes, and horizontal rules — and is
 * tolerant of the partial markdown that appears mid-stream. Everything is
 * rendered as React nodes (never dangerouslySetInnerHTML), so user/model text
 * can't inject HTML.
 */

let keySeed = 0;
function nextKey(): string {
  keySeed += 1;
  return `md-${keySeed}`;
}

// NOTE: build a *fresh* regex per call. A shared /g regex keeps `lastIndex`
// state, and because renderInline recurses (for the inner text of bold/italic/
// link tokens) a shared instance would get its lastIndex reset mid-iteration
// and re-match the same token forever.
const INLINE_SOURCE =
  '(\\*\\*[^*]+\\*\\*|__[^_]+__|\\*[^*\\n]+\\*|_[^_\\n]+_|`[^`]+`|\\[[^\\]]+\\]\\([^)\\s]+\\))';

function safeHref(url: string): string | null {
  const u = url.trim();
  if (u.startsWith('/') || u.startsWith('#')) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (/^tel:/i.test(u) || /^mailto:/i.test(u)) return u;
  return null;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(INLINE_SOURCE, 'g');

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(<strong key={nextKey()}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith('__') && token.endsWith('__')) {
      nodes.push(<strong key={nextKey()}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code key={nextKey()} className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-gray-800">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (linkMatch) {
        const href = safeHref(linkMatch[2]);
        if (href) {
          const external = /^https?:/i.test(href);
          nodes.push(
            <a
              key={nextKey()}
              href={href}
              className="font-medium text-emerald-700 underline hover:text-emerald-800"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {renderInline(linkMatch[1])}
            </a>
          );
        } else {
          nodes.push(linkMatch[1]);
        }
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith('*') || token.startsWith('_')) {
      nodes.push(<em key={nextKey()}>{renderInline(token.slice(1, -1))}</em>);
    } else {
      nodes.push(token);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; lines: string[] }
  | { type: 'hr' }
  | { type: 'p'; text: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    // Heading
    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', lines: quoteLines });
      continue;
    }

    // Paragraph (consume until blank line or a new block starts)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trim();
      if (
        t === '' ||
        /^(#{1,4})\s+/.test(t) ||
        /^[-*+]\s+/.test(t) ||
        /^\d+[.)]\s+/.test(t) ||
        /^>\s?/.test(t) ||
        /^(-{3,}|_{3,}|\*{3,})$/.test(t)
      ) {
        break;
      }
      paraLines.push(t);
      i += 1;
    }
    blocks.push({ type: 'p', text: paraLines.join(' ') });
  }

  return blocks;
}

export default function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-3 leading-relaxed">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const sizes: Record<number, string> = {
              1: 'text-lg font-bold',
              2: 'text-base font-bold',
              3: 'text-base font-semibold',
              4: 'text-sm font-semibold',
            };
            const cls = sizes[block.level] ?? 'font-semibold';
            return (
              <p key={nextKey()} className={`${cls} text-gray-900`}>
                {renderInline(block.text)}
              </p>
            );
          }
          case 'ul':
            return (
              <ul key={nextKey()} className="list-disc space-y-1 pl-5">
                {block.items.map((it) => (
                  <li key={nextKey()}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={nextKey()} className="list-decimal space-y-1 pl-5">
                {block.items.map((it) => (
                  <li key={nextKey()}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote
                key={nextKey()}
                className="border-l-4 border-emerald-200 pl-3 italic text-gray-600"
              >
                {block.lines.map((l) => (
                  <p key={nextKey()}>{renderInline(l)}</p>
                ))}
              </blockquote>
            );
          case 'hr':
            return <hr key={nextKey()} className="border-gray-200" />;
          case 'p':
          default:
            return (
              <p key={nextKey()}>
                {(block as { text: string }).text.split('\n').map((line, idx, arr) => (
                  <Fragment key={nextKey()}>
                    {renderInline(line)}
                    {idx < arr.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
