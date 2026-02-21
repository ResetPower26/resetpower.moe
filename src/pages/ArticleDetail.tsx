// Responsible for rendering the full article detail page with Markdown content.

import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { useArticleDetail } from "../hooks/useArticleDetail";

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

export function ArticleDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { article, isLoading, errorMessage } = useArticleDetail(slug);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (errorMessage || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-500">{errorMessage ?? "文章不存在。"}</p>
        <Link
          to="/articles"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← 返回文章列表
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        to="/articles"
        className="text-sm text-blue-600 hover:underline mb-8 inline-block"
      >
        ← 返回文章列表
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mt-4">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <time dateTime={new Date(article.created_at * 1000).toISOString()}>
          {formatDate(article.created_at)}
        </time>
        <span>作者：{article.author}</span>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Disclosure */}
      {article.disclosure && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠ 创作声明：{article.disclosure}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-slate max-w-none mt-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
