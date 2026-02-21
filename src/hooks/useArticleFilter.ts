// Responsible for filtering, sorting, and searching articles based on user input.
import { useMemo, useState } from "react";
import type { Article } from "../types";

export type SortOrder = "date-desc" | "date-asc" | "title-asc" | "title-desc";

function sortArticles(articles: Article[], order: SortOrder): Article[] {
  const strategies: Record<SortOrder, (a: Article, b: Article) => number> = {
    "date-desc": (a, b) => b.created_at - a.created_at,
    "date-asc": (a, b) => a.created_at - b.created_at,
    "title-asc": (a, b) => a.title.localeCompare(b.title, "zh"),
    "title-desc": (a, b) => b.title.localeCompare(a.title, "zh"),
  };
  return [...articles].sort(strategies[order]);
}

function filterBySearch(articles: Article[], query: string): Article[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return articles;
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(normalized) ||
      a.summary.toLowerCase().includes(normalized),
  );
}

function filterByTag(articles: Article[], tag: string): Article[] {
  if (!tag) return articles;
  return articles.filter((a) => a.tags.includes(tag));
}

export function useArticleFilter(articles: Article[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-desc");
  const [activeTag, setActiveTag] = useState("");

  const allTags = useMemo(
    () => Array.from(new Set(articles.flatMap((a) => a.tags))).sort(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const bySearch = filterBySearch(articles, searchQuery);
    const byTag = filterByTag(bySearch, activeTag);
    return sortArticles(byTag, sortOrder);
  }, [articles, searchQuery, activeTag, sortOrder]);

  return {
    filteredArticles,
    allTags,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    activeTag,
    setActiveTag,
  };
}
