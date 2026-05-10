import type { ReactNode } from "react";

interface MarkdownContentProps {
  content: string;
}

type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string };

const inlineCodePattern = /`([^`]+)`/g;
const urlPattern = /(https?:\/\/[^\s)]+)/g;

const renderInlineText = (text: string) => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const matches = [...text.matchAll(inlineCodePattern)];

  matches.forEach((match, index) => {
    const [raw, code] = match;
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      nodes.push(
        renderLinks(text.slice(lastIndex, matchIndex), `text-${index}`),
      );
    }
    nodes.push(
      <code key={`code-${index}`} className="markdown-inline-code">
        {code}
      </code>,
    );
    lastIndex = matchIndex + raw.length;
  });

  if (lastIndex < text.length) {
    nodes.push(renderLinks(text.slice(lastIndex), "text-last"));
  }

  return nodes;
};

const renderLinks = (text: string, keyPrefix: string) => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const matches = [...text.matchAll(urlPattern)];

  matches.forEach((match, index) => {
    const [url] = match;
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }
    nodes.push(
      <a
        key={`${keyPrefix}-link-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {url}
      </a>,
    );
    lastIndex = matchIndex + url.length;
  });

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const parseMarkdown = (content: string): MarkdownBlock[] => {
  const lines = content.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let isCodeBlock = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (isCodeBlock) {
        blocks.push({ type: "code", text: codeLines.join("\n") });
        codeLines = [];
      } else {
        flushParagraph();
        flushList();
      }
      isCodeBlock = !isCodeBlock;
      return;
    }

    if (isCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      return;
    }

    const listMatch = line.match(/^-\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      return;
    }

    flushList();
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();

  return blocks;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="markdown-doc">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = `h${Math.min(block.level, 3)}` as "h1" | "h2" | "h3";
          return <Heading key={index}>{block.text}</Heading>;
        }

        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineText(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.text}</code>
            </pre>
          );
        }

        return <p key={index}>{renderInlineText(block.text)}</p>;
      })}
    </div>
  );
}
