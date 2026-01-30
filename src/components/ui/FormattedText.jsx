import React from 'react';

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  // Handle both real newlines and escaped newlines coming from APIs.
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .trim();
};

const isHeading = (line) => /^#{1,6}\s+/.test(line);
const isBullet = (line) => /^\s*(?:[-*•]|\u2022)\s+/.test(line);
const isNumbered = (line) => /^\s*\d+[.)]\s+/.test(line);

const stripHeading = (line) => line.replace(/^#{1,6}\s+/, '').trim();
const stripBullet = (line) => line.replace(/^\s*(?:[-*•]|\u2022)\s+/, '').trim();
const stripNumbered = (line) => line.replace(/^\s*\d+[.)]\s+/, '').trim();

const isHr = (line) => {
  const trimmed = line.trim();
  return trimmed === '---' || trimmed === '***' || trimmed === '___';
};

const renderInline = (text) => {
  const renderInlineFormatting = (value) => {
    // Minimal, safe markdown-ish inline renderer.
    // Supports: `code`, **bold**, *italic* (or _italic_)
    const parts = String(value).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);
    return parts
      .filter((p) => p !== '')
      .map((part, idx) => {
        if (/^`[^`]+`$/.test(part)) {
          return (
            <code
              key={idx}
              className="px-1 py-0.5 rounded bg-gray-100 text-gray-900 text-[0.95em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return (
            <strong key={idx} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (/^\*[^*]+\*$/.test(part)) {
          return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        if (/^_[^_]+_$/.test(part)) {
          return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      });
  };

  const isSafeUrl = (url) => /^https?:\/\//i.test(url);

  const cleanBareUrl = (url) => {
    let cleaned = String(url);
    // Trim common trailing punctuation while keeping valid URL chars.
    while (/[),.;:!?\]]$/.test(cleaned)) cleaned = cleaned.slice(0, -1);
    return cleaned;
  };

  const formatUrlLabel = (url) => {
    try {
      const u = new URL(url);
      const shownPath = u.pathname && u.pathname !== '/' ? u.pathname : '';
      const label = `${u.hostname}${shownPath}`;
      return label.length > 60 ? `${label.slice(0, 57)}...` : label;
    } catch {
      return url;
    }
  };

  const input = String(text);
  const linkRegex = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))|(https?:\/\/[^\s]+)/g;
  const nodes = [];

  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = linkRegex.exec(input)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      nodes.push(
        <React.Fragment key={`t-${key++}`}>
          {renderInlineFormatting(input.slice(lastIndex, matchIndex))}
        </React.Fragment>
      );
    }

    // Markdown link: [label](url)
    if (match[2] && match[3]) {
      const label = match[2];
      const url = match[3];

      if (isSafeUrl(url)) {
        nodes.push(
          <a
            key={`a-${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 hover:decoration-blue-500 break-all"
            title={url}
          >
            {renderInlineFormatting(label)}
          </a>
        );
      } else {
        nodes.push(
          <React.Fragment key={`t-${key++}`}>
            {renderInlineFormatting(match[0])}
          </React.Fragment>
        );
      }

      lastIndex = matchIndex + match[0].length;
      continue;
    }

    // Bare URL
    if (match[4]) {
      const url = cleanBareUrl(match[4]);
      if (isSafeUrl(url)) {
        nodes.push(
          <a
            key={`a-${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 hover:decoration-blue-500 break-all"
            title={url}
          >
            {formatUrlLabel(url)}
          </a>
        );
      } else {
        nodes.push(
          <React.Fragment key={`t-${key++}`}>
            {renderInlineFormatting(match[4])}
          </React.Fragment>
        );
      }
      lastIndex = matchIndex + match[4].length;
      continue;
    }
  }

  if (lastIndex < input.length) {
    nodes.push(
      <React.Fragment key={`t-${key++}`}>
        {renderInlineFormatting(input.slice(lastIndex))}
      </React.Fragment>
    );
  }

  return nodes;
};

const toPlain = (line) => {
  if (!line) return '';
  return String(line)
    .replace(/^#{1,6}\s+/, '')
    .replace(/^\s*(?:[-*•]|\u2022)\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
};

const getCalloutKind = (line) => {
  const plain = toPlain(line).toLowerCase();
  if (plain === 'disclaimer') return 'disclaimer';
  if (plain === 'warning' || plain.startsWith('warning')) return 'warning';
  if (plain === 'important' || plain.startsWith('important')) return 'important';
  if (plain === 'note' || plain.startsWith('note')) return 'note';
  return null;
};

const calloutStyles = {
  disclaimer: {
    wrap: 'border-amber-200 bg-amber-50/70',
    title: 'text-amber-900',
    icon: '⚠',
    label: 'Disclaimer',
  },
  warning: {
    wrap: 'border-red-200 bg-red-50/70',
    title: 'text-red-900',
    icon: '⛔',
    label: 'Warning',
  },
  important: {
    wrap: 'border-blue-200 bg-blue-50/70',
    title: 'text-blue-900',
    icon: 'ℹ',
    label: 'Important',
  },
  note: {
    wrap: 'border-emerald-200 bg-emerald-50/70',
    title: 'text-emerald-900',
    icon: '📝',
    label: 'Note',
  },
};

const parseLinesToBlocks = (lines, { enableCallouts } = { enableCallouts: true }) => {
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i += 1;
      continue;
    }

    const calloutKind = enableCallouts ? getCalloutKind(line) : null;
    if (calloutKind) {
      const style = calloutStyles[calloutKind] || calloutStyles.note;
      const titleText = toPlain(line) || style.label;

      i += 1;
      const calloutLines = [];
      while (i < lines.length) {
        const peekRaw = lines[i];
        const peek = peekRaw.trim();
        if (!peek) {
          // allow single blank line inside callout, but stop if we see multiple blanks
          const next = lines[i + 1]?.trim();
          if (!next) {
            i += 1;
            break;
          }
          calloutLines.push('');
          i += 1;
          continue;
        }
        if (isHr(peek) || isHeading(peek) || getCalloutKind(peek)) break;
        calloutLines.push(peekRaw);
        i += 1;
      }

      const inner = parseLinesToBlocks(calloutLines, { enableCallouts: false });
      blocks.push(
        <div
          key={`callout-${key++}`}
          className={`rounded-xl border p-4 ${style.wrap}`}
        >
          <div className={`flex items-center gap-2 font-semibold ${style.title} mb-2`}>
            <span aria-hidden="true">{style.icon}</span>
            <span>{titleText}</span>
          </div>
          <div className="space-y-2">{inner}</div>
        </div>
      );
      continue;
    }

    if (isHeading(line)) {
      blocks.push(
        <h4 key={`h-${key++}`} className="font-semibold text-gray-900 mt-4 first:mt-0">
          {renderInline(stripHeading(line))}
        </h4>
      );
      i += 1;
      continue;
    }

    if (isHr(line)) {
      blocks.push(<hr key={`hr-${key++}`} className="my-3 border-gray-200" />);
      i += 1;
      continue;
    }

    if (isBullet(line)) {
      const items = [];
      while (i < lines.length && isBullet(lines[i].trim())) {
        const item = stripBullet(lines[i]);
        if (item) items.push(item);
        i += 1;
      }

      blocks.push(
        <ul key={`ul-${key++}`} className="list-disc pl-6 space-y-1 text-gray-800">
          {items.map((item, idx) => (
            <li key={`uli-${idx}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (isNumbered(line)) {
      const items = [];
      while (i < lines.length && isNumbered(lines[i].trim())) {
        const item = stripNumbered(lines[i]);
        if (item) items.push(item);
        i += 1;
      }

      blocks.push(
        <ol key={`ol-${key++}`} className="list-decimal pl-6 space-y-1 text-gray-800">
          {items.map((item, idx) => (
            <li key={`oli-${idx}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph: merge consecutive non-empty lines until a blank or list/heading starts.
    const parts = [line];
    i += 1;
    while (i < lines.length) {
      const peek = lines[i].trim();
      if (!peek) break;
      if (isHeading(peek) || isHr(peek) || isBullet(peek) || isNumbered(peek) || getCalloutKind(peek)) break;
      parts.push(peek);
      i += 1;
    }

    const paragraph = parts.join(' ');
    const isLabel = /:$/.test(paragraph) && paragraph.length <= 80;

    blocks.push(
      <p
        key={`p-${key++}`}
        className={
          isLabel
            ? 'font-semibold text-gray-900 mt-3 first:mt-0'
            : 'text-gray-800 leading-relaxed'
        }
      >
        {renderInline(paragraph)}
      </p>
    );
  }

  return blocks;
};

const FormattedText = ({ text, className = '' }) => {
  const normalized = normalizeText(text);
  if (!normalized) {
    return <div className={className}>No content available</div>;
  }

  const lines = normalized.split('\n');
  const blocks = parseLinesToBlocks(lines, { enableCallouts: true });
  return <div className={`space-y-2 ${className}`}>{blocks}</div>;
};

export default FormattedText;
