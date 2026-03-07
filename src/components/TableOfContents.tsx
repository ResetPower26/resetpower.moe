// Responsible for rendering the article table of contents as a collapsible sidebar/drawer panel.
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { TocHeading } from "../hooks/useTableOfContents";

function TocItem({ heading, depth }: { heading: TocHeading; depth: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = heading.children.length > 0;

  return (
    <li>
      <div
        className="flex items-center gap-2"
        style={{ paddingLeft: `${depth * 14}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
            aria-label={isOpen ? "收起" : "展开"}
          >
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="shrink-0 w-6" />
        )}
        <a
          href={`#${heading.id}`}
          className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors leading-snug py-1 truncate"
        >
          {heading.text}
        </a>
      </div>
      {hasChildren && isOpen && (
        <ul className="mt-1 space-y-1">
          {heading.children.map((child) => (
            <TocItem key={child.id} heading={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Desktop sidebar panel: shows heading list only (toggle button is owned by the parent aside).
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  return (
    <nav aria-label="文章目录" className="flex flex-col overflow-hidden flex-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        目录
      </p>
      {headings.length === 0 ? (
        <p className="text-sm text-slate-400">本文暂无目录项。</p>
      ) : (
        <ul className="space-y-1 overflow-y-auto flex-1">
          {headings.map((heading) => (
            <TocItem key={heading.id} heading={heading} depth={0} />
          ))}
        </ul>
      )}
    </nav>
  );
}

// Mobile drawer panel: includes a close button at the top.
export function TableOfContentsMobileDrawer({
  headings,
  onClose,
}: {
  headings: TocHeading[];
  onClose: () => void;
}) {
  return (
    <nav aria-label="文章目录" className="flex flex-col h-full">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-colors cursor-pointer"
          aria-label="关闭目录"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        目录
      </p>
      {headings.length === 0 ? (
        <p className="text-sm text-slate-400">本文暂无目录项。</p>
      ) : (
        <ul className="space-y-1 overflow-y-auto flex-1">
          {headings.map((heading) => (
            <TocItem key={heading.id} heading={heading} depth={0} />
          ))}
        </ul>
      )}
    </nav>
  );
}
