// Responsible for managing admin CRUD state for the articles table.
import { useCallback, useEffect, useState } from "react";
import {
  type ArticleInput,
  createArticle,
  deleteArticle,
  fetchArticleList,
  updateArticle,
} from "../services/articles";
import type { Article } from "../types";

type ArticleUpdateInput = Omit<ArticleInput, "slug">;

interface UseAdminArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  submitArticle: (
    input: ArticleInput,
    id?: string,
  ) => Promise<{ success: boolean; conflict?: boolean }>;
  removeArticle: (id: string) => Promise<boolean>;
}

export function useAdminArticles(): UseAdminArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArticleList();
      setArticles(data);
    } catch {
      setError("加载文章列表失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const submitArticle = useCallback(
    async (
      input: ArticleInput,
      id?: string,
    ): Promise<{ success: boolean; conflict?: boolean }> => {
      try {
        if (id !== undefined) {
          const updateInput: ArticleUpdateInput = {
            title: input.title,
            summary: input.summary,
            content: input.content,
            tags: input.tags,
            disclosure: input.disclosure,
          };
          await updateArticle(id, updateInput);
        } else {
          await createArticle(input);
        }
        await loadArticles();
        return { success: true };
      } catch (err) {
        const isConflict = err instanceof Error && err.message.includes("409");
        return { success: false, conflict: isConflict };
      }
    },
    [loadArticles],
  );

  const removeArticle = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteArticle(id);
        await loadArticles();
        return true;
      } catch {
        return false;
      }
    },
    [loadArticles],
  );

  return { articles, isLoading, error, submitArticle, removeArticle };
}
