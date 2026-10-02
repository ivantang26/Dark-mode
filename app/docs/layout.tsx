import DocsNav from "@/components/DocsNav";
import { getDocsOutline } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const outline = getDocsOutline();
  return (
    <div className="relative">
      <div className="grid-lines opacity-60" aria-hidden="true" />
      <div className="container-x relative grid gap-8 py-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <DocsNav outline={outline} />
        <article className="prose min-w-0">{children}</article>
      </div>
    </div>
  );
}
