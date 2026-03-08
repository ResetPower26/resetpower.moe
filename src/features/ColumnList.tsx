// Responsible for rendering the columns list as a card grid with loading and error states.
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { useColumns } from "../hooks/useColumns";

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ColumnListSkeleton() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="h-36 w-full rounded-lg bg-slate-200 mb-4" />
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-200" />
          <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function ColumnList() {
  const { columns, isLoading, errorMessage } = useColumns();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ColumnListSkeleton />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mt-16 text-center text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mt-16 text-center text-slate-500">暂无专栏。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {columns.map((column) => (
          <Card
            key={column.id}
            className="flex flex-col overflow-hidden p-0 hover:shadow-lg transition-shadow duration-300"
          >
            {column.cover_image ? (
              <img
                src={column.cover_image}
                alt={column.name}
                className="h-36 w-full object-cover"
              />
            ) : (
              <div className="h-36 w-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                <span className="text-slate-300 text-4xl font-bold select-none">
                  专栏
                </span>
              </div>
            )}
            <div className="p-5 flex flex-col grow">
              <h3 className="text-lg font-semibold text-slate-900">
                {column.name}
              </h3>
              {column.description && (
                <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
                  {column.description}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                共 {column.articles.length} 篇文章
              </p>
              {column.articles.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                  {column.articles.slice(0, 5).map((article) => (
                    <li key={article.id}>
                      <Link
                        to={`/articles/${article.slug}`}
                        className="flex items-start justify-between gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors group"
                      >
                        <span className="line-clamp-1 grow">
                          {article.title}
                        </span>
                        <time className="shrink-0 text-xs text-slate-400 group-hover:text-slate-500 mt-0.5">
                          {formatDate(article.created_at)}
                        </time>
                      </Link>
                    </li>
                  ))}
                  {column.articles.length > 5 && (
                    <li className="text-xs text-slate-400 pt-0.5">
                      还有 {column.articles.length - 5} 篇...
                    </li>
                  )}
                </ul>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
