import React from 'react';

export const RICH_TEXT_STYLES = {
  mark: 'text-red-600 font-bold',
  red: 'text-red-600 font-semibold',
  danger: 'text-red-600 font-semibold',
  amber: 'text-amber-600 font-semibold',
  warning: 'text-amber-600 font-semibold',
  green: 'text-emerald-600 font-semibold',
  success: 'text-emerald-600 font-semibold',
  blue: 'text-blue-600 font-semibold',
  info: 'text-blue-600 font-semibold',
  primary: 'text-primary-700 font-semibold',
  muted: 'text-neutral-600',
  strong: 'font-semibold text-primary-900',
  underline: 'underline',
} as const;

function renderBracketHighlights(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const bracketHighlightRegex = /《[^》]+》/g;

  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = bracketHighlightRegex.exec(text))) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }
    nodes.push(
      <span key={`${keyPrefix}-mark-${matchIndex}`} className={RICH_TEXT_STYLES.mark}>
        {match[0]}
      </span>
    );
    lastIndex = start + match[0].length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderRichTextInternal(text: string, keyPrefix: string, depth: number) {
  if (!text) return [];
  if (depth > 8) return [text];

  const nodes: React.ReactNode[] = [];
  const styleTokenRegex = /\{\{([a-zA-Z0-9_-]+):([\s\S]*?)\}\}/g;

  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = styleTokenRegex.exec(text))) {
    const start = match.index ?? 0;
    const [fullMatch, rawStyleKey, rawContent] = match;
    const styleKey = (rawStyleKey || '').trim();
    const content = rawContent ?? '';

    if (start > lastIndex) {
      nodes.push(...renderBracketHighlights(text.slice(lastIndex, start), `${keyPrefix}-p-${matchIndex}`));
    }

    const children = renderRichTextInternal(content, `${keyPrefix}-s-${matchIndex}`, depth + 1);
    const styleClass =
      (RICH_TEXT_STYLES as Record<string, string | undefined>)[styleKey];

    if (styleClass) {
      nodes.push(
        <span key={`${keyPrefix}-span-${matchIndex}`} className={styleClass}>
          {children}
        </span>
      );
    } else {
      nodes.push(...children);
    }

    lastIndex = start + fullMatch.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderBracketHighlights(text.slice(lastIndex), `${keyPrefix}-tail`));
  }

  return nodes;
}

export function renderRichText(text: string) {
  return renderRichTextInternal(text, 'rt', 0);
}

export function RichText({ text }: { text?: string }) {
  if (!text) return null;
  return <>{renderRichText(text)}</>;
}
