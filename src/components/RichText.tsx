import type { ReactNode } from "react";

/** Inline `**bold**` only. Everything is rendered as React text: no HTML from the dashboard is ever injected. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (/^\*\*[^*]+\*\*$/.test(part) ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

/**
 * Renders the dashboard's tiny text format: `## Heading`, `- list item`, `**bold**`, blank line = new paragraph.
 * Safe by construction (no dangerouslySetInnerHTML).
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const out: ReactNode[] = [];
        let list: string[] = [];
        const flush = () => {
          if (list.length) out.push(<ul key={`l${out.length}`} className="list-disc space-y-1.5 ps-5">{list.map((li, k) => <li key={k}>{inline(li)}</li>)}</ul>);
          list = [];
        };
        for (const line of lines) {
          if (/^\s*-\s+/.test(line)) list.push(line.replace(/^\s*-\s+/, ""));
          else if (/^##\s+/.test(line)) {
            flush();
            out.push(<h2 key={`h${out.length}`} className="pt-3 text-lg font-semibold">{inline(line.replace(/^##\s+/, ""))}</h2>);
          } else {
            flush();
            out.push(<p key={`p${out.length}`}>{inline(line)}</p>);
          }
        }
        flush();
        return <div key={i} className="space-y-3">{out}</div>;
      })}
    </div>
  );
}
