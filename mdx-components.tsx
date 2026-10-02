import type { MDXComponents } from "mdx/types";
import type { ReactElement } from "react";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import { slugify, textOf } from "@/lib/slug";

function Heading({ as: Tag, children }: { as: "h2" | "h3"; children?: React.ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <Tag id={id} className="group scroll-mt-24">
      {children}
      <a href={`#${id}`} className="ml-2 font-mono text-[0.7em] text-mute no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label="Link to this section">
        #
      </a>
    </Tag>
  );
}

/** Fenced code blocks: pull the language off <code class="language-x"> and highlight at build time. */
async function Pre({ children }: { children?: React.ReactNode }) {
  const code = children as ReactElement<{ className?: string; children?: string }>;
  const lang = code?.props?.className?.replace("language-", "") ?? "text";
  return <CodeBlock code={String(code?.props?.children ?? "")} lang={lang} where="docs" />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (p) => <Heading as="h2" {...p} />,
    h3: (p) => <Heading as="h3" {...p} />,
    pre: Pre,
    code: ({ children }) => <code className="inline">{children}</code>,
    a: ({ href = "", children }) =>
      href.startsWith("/") || href.startsWith("#") ? (
        <Link href={href}>{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      ),
    ...components,
  };
}
