// Responsible for rendering the full article detail page with Markdown content and a table of contents.

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { BackButton } from "../components/BackButton";
import {
  TableOfContents,
  TableOfContentsMobileDrawer,
} from "../components/TableOfContents";
import { useArticleColumn } from "../hooks/useArticleColumn";
import { useArticleDetail } from "../hooks/useArticleDetail";
import { useTableOfContents } from "../hooks/useTableOfContents";
import { slugify } from "../utils/slugify";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Recursively extract plain text from React children (handles strings, arrays, and elements).
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
  if (node !== null && typeof node === "object" && "props" in node) {
    return extractTextFromNode(
      (node as React.ReactElement<{ children?: React.ReactNode }>).props
        .children,
    );
  }
  return "";
}

function makeHeadingComponent(Tag: HeadingLevel) {
  return function HeadingWithId({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = extractTextFromNode(children);
    return (
      <Tag id={slugify(text)} {...props}>
        {children}
      </Tag>
    );
  };
}

const markdownHeadingComponents = {
  h1: makeHeadingComponent("h1"),
  h2: makeHeadingComponent("h2"),
  h3: makeHeadingComponent("h3"),
  h4: makeHeadingComponent("h4"),
  h5: makeHeadingComponent("h5"),
  h6: makeHeadingComponent("h6"),
};

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ArticleDetailSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto px-6 py-16">
      <div className="h-10 w-2/3 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-1/4 rounded bg-slate-200" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 rounded bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none mt-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownHeadingComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function ArticleMeta({
  title,
  createdAt,
  updatedAt,
  author,
  tags,
  disclosure,
  columnId,
}: {
  title: string;
  createdAt: number;
  updatedAt: number | null;
  author: string;
  tags: string[];
  disclosure?: string;
  columnId: number | null;
}) {
  const { column } = useArticleColumn(columnId);
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <time dateTime={new Date(createdAt * 1000).toISOString()}>
          发布于 {formatDate(createdAt)}
        </time>
        {updatedAt !== null && (
          <time dateTime={new Date(updatedAt * 1000).toISOString()}>
            最后修改于 {formatDate(updatedAt)}
          </time>
        )}
        <span>作者：{author}</span>
      </div>
      {column && (
        <p className="mt-2 text-sm text-slate-500">
          来自专栏{" "}
          <Link
            to={`/columns/${column.id}`}
            className="text-blue-500 font-medium hover:text-blue-600 hover:underline"
          >
            {column.name}
          </Link>
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {disclosure && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠ 创作声明：{disclosure}
        </div>
      )}
    </>
  );
}

export function ArticleDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { article, isLoading, errorMessage } = useArticleDetail(slug);
  const headings = useTableOfContents(article?.content ?? "");

  // Desktop sidebar: open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Mobile drawer: closed by default
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (!article) return;
    document.title = article.title;
    return () => {
      document.title = "ResetPower";
    };
  }, [article]);

  if (isLoading) return <ArticleDetailSkeleton />;
  if (errorMessage || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-500">{errorMessage ?? "文章不存在。"}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen">
      {/* ── Desktop sidebar (lg+) ── */}
      <aside
        className={`
          hidden lg:flex flex-col sticky top-16 shrink-0
          h-[calc(100vh-4rem)] border-r border-slate-100 bg-white overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 px-6 py-6" : "w-10 items-center py-6"}
        `}
      >
        {/* Sidebar toggle button — always visible */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className={`shrink-0 mb-4 flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-colors cursor-pointer ${isSidebarOpen ? "self-end" : "self-center"}`}
          aria-label={isSidebarOpen ? "收起目录" : "展开目录"}
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
        {/* Always rendered; fades in/out with the width transition */}
        <div
          className={`flex-1 min-h-0 transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <TableOfContents headings={headings} articleKey={slug} />
        </div>
      </aside>

      {/* ── Mobile drawer toggle button (< lg) ── */}
      <button
        type="button"
        onClick={() => setIsMobileDrawerOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-colors cursor-pointer"
        aria-label="展开目录"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ── Mobile drawer overlay (< lg) — always in DOM, animated via opacity/translate ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="文章目录"
        aria-hidden={!isMobileDrawerOpen}
        className={`lg:hidden fixed inset-x-0 bottom-0 top-16 z-[60] flex transition-opacity duration-300 ease-in-out ${isMobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onKeyDown={(e) => e.key === "Escape" && setIsMobileDrawerOpen(false)}
      >
        {/* backdrop */}
        <button
          type="button"
          className="absolute inset-0 bg-black/30 w-full cursor-default"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-label="关闭目录"
          tabIndex={isMobileDrawerOpen ? 0 : -1}
        />
        {/* drawer panel — slides in from the left */}
        <div
          className={`relative z-[61] w-72 h-full bg-white shadow-xl px-6 py-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <TableOfContentsMobileDrawer
            headings={headings}
            articleKey={slug}
            onClose={() => setIsMobileDrawerOpen(false)}
          />
        </div>
      </div>

      {/* ── Main article content ── */}
      <article className="flex-1 min-w-0 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-6">
          <BackButton to="/articles" />
          <span className="text-slate-700">返回文章列表</span>
        </div>
        <ArticleMeta
          title={article.title}
          createdAt={article.created_at}
          updatedAt={article.updated_at}
          author={article.author}
          tags={article.tags}
          disclosure={article.disclosure}
          columnId={article.column_id}
        />
        <ArticleBody content={article.content} />
      </article>
    </div>
  );
}
