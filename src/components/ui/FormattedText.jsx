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
  // Minimal, safe markdown-ish inline renderer.
  // Supports: `code`, **bold**, *italic* (or _italic_)
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);
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

const FormattedText = ({ text, className = '' }) => {
  const normalized = normalizeText(text);
  if (!normalized) {
    return <div className={className}>No content available</div>;
  }

  const lines = normalized.split('\n');
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
      blocks.push(
        <hr key={`hr-${key++}`} className="my-3 border-gray-200" />
      );
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
      if (isHeading(peek) || isBullet(peek) || isNumbered(peek)) break;
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

  return <div className={`space-y-2 ${className}`}>{blocks}</div>;
};

export default FormattedText;
