// Responsible for rendering the column detail page with its metadata and all associated article cards.
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { Card } from "../components/Card";
import { useColumn } from "../hooks/useColumn";
import type { ArticleSummary } from "../types";

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ColumnDetailSkeleton() {
  return (
    <div className="animate-pulse max-w-5xl mx-auto px-6 py-16">
      <div className="h-48 w-full rounded-2xl bg-slate-200 mb-8" />
      <div className="h-8 w-1/3 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full rounded bg-slate-200" />
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ColumnArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link to={`/articles/${article.slug}`} className="block">
      <Card className="flex max-w-xl flex-col items-start justify-between p-6 h-full hover:shadow-lg transition-shadow duration-300">
        <div className="text-xs text-slate-500">
          <time dateTime={new Date(article.created_at * 1000).toISOString()}>
            {formatDate(article.created_at)}
          </time>
        </div>
        <div className="mt-4 grow">
          <h3 className="text-xl font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
            {article.summary}
          </p>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          <span>作者：{article.author}</span>
        </div>
      </Card>
    </Link>
  );
}

export function ColumnDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { column, isLoading, errorMessage } = useColumn(numericId);

  useEffect(() => {
    if (!column) return;
    document.title = `${column.name} · 专栏`;
    return () => {
      document.title = "ResetPower";
    };
  }, [column]);

  if (isLoading) return <ColumnDetailSkeleton />;

  if (errorMessage || !column) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-red-500">{errorMessage ?? "专栏不存在。"}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back navigation */}
        <div className="flex items-center gap-2 mb-10">
          <BackButton to="/articles#columns" />
          <span className="text-slate-700">返回专栏列表</span>
        </div>

        {/* Column header */}
        <div className="mb-12">
          {column.cover_image ? (
            <img
              src={column.cover_image}
              alt={column.name}
              className="w-full max-h-56 object-cover rounded-2xl mb-8"
            />
          ) : (
            <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center mb-8">
              <span className="text-slate-300 text-5xl font-bold select-none">
                专栏
              </span>
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {column.name}
          </h1>
          {column.description && (
            <p className="mt-3 text-lg text-slate-600">{column.description}</p>
          )}
          <p className="mt-2 text-sm text-slate-400">
            共 {column.articles.length} 篇文章
          </p>
        </div>

        {/* Article cards */}
        {column.articles.length === 0 ? (
          <p className="text-center text-slate-500">该专栏暂无文章。</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {column.articles.map((article) => (
              <ColumnArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
