import { highlight } from "@/lib/highlight";
import CopyButton from "./CopyButton";

/** A single highlighted block with a filename/language bar and copy button. */
export default async function CodeBlock({ code, lang, title, where }: { code: string; lang: string; title?: string; where?: string }) {
  const html = await highlight(code, lang);
  return (
    <div className="code">
      <div className="flex items-center justify-between gap-3 border-b border-line py-1.5 pl-4 pr-2">
        <span className="truncate font-mono text-[12px] text-mute">{title ?? lang}</span>
        <CopyButton text={code.replace(/\n$/, "")} where={where ?? "code-block"} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
