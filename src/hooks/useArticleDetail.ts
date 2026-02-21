// Responsible for fetching a single article by slug and managing loading/error state.
import { useEffect, useState } from "react";
import { fetchArticleBySlug } from "../services/articles";
import type { ArticleDetail } from "../types";

interface UseArticleDetailResult {
  article: ArticleDetail | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useArticleDetail(slug: string): UseArticleDetailResult {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    fetchArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setErrorMessage("文章加载失败，请稍后再试。"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { article, isLoading, errorMessage };
}
