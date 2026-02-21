// Responsible for fetching the article list and managing loading/error state.
import { useEffect, useState } from "react";
import { fetchArticleList } from "../services/articles";
import type { Article } from "../types";

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchArticleList()
      .then(setArticles)
      .catch(() => setErrorMessage("文章加载失败，请稍后再试。"))
      .finally(() => setIsLoading(false));
  }, []);

  return { articles, isLoading, errorMessage };
}
