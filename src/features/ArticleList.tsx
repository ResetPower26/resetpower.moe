// Responsible for rendering the articles list with search, sort, and tag filter controls.
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { DropdownSelect } from "../components/DropdownSelect";
import { SearchInput } from "../components/SearchInput";
import { type SortOrder, useArticleFilter } from "../hooks/useArticleFilter";
import { useArticles } from "../hooks/useArticles";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "date-desc", label: "新文章优先" },
  { value: "date-asc", label: "旧文章优先" },
  { value: "title-asc", label: "名称 A-Z" },
  { value: "title-desc", label: "名称 Z-A" },
];

function buildTagOptions(tags: string[]): { value: string; label: string }[] {
  return [
    { value: "", label: "全部标签" },
    ...tags.map((t) => ({ value: t, label: t })),
  ];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleListSkeleton() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-200" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function ArticleList() {
  const { articles, isLoading, errorMessage } = useArticles();
  const {
    filteredArticles,
    allTags,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    activeTag,
    setActiveTag,
  } = useArticleFilter(articles);

  return (
    <div className="bg-slate-50 py-24 sm:py-32" id="articles">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            文章
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-600">一些文章🤔</p>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-10 max-w-4xl flex flex-col sm:flex-row gap-3">
          <div className="grow">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
          <DropdownSelect
            value={sortOrder}
            onChange={setSortOrder}
            options={SORT_OPTIONS}
            label="排序方式"
          />
          <DropdownSelect
            value={activeTag}
            onChange={setActiveTag}
            options={buildTagOptions(allTags)}
            label="全部标签"
          />
        </div>

        {/* Results */}
        {isLoading && <ArticleListSkeleton />}

        {errorMessage && (
          <p className="mt-16 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && filteredArticles.length === 0 && (
          <p className="mt-16 text-center text-slate-500">
            没有找到匹配的文章。
          </p>
        )}

        {!isLoading && !errorMessage && filteredArticles.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="flex max-w-xl flex-col items-start justify-between p-6 h-full hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <time
                    dateTime={new Date(article.created_at * 1000).toISOString()}
                    className="text-slate-500"
                  >
                    {formatDate(article.created_at)}
                  </time>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="group relative mt-4 grow">
                  <h3 className="text-xl font-semibold leading-6 text-slate-900 group-hover:text-blue-600 transition-colors">
                    <Link to={`/articles/${article.slug}`}>
                      <span className="absolute inset-0" />
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 w-full">
                  <span>作者：{article.author}</span>
                  {article.disclosure && (
                    <span className="text-amber-600">
                      ⚠ {article.disclosure}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
