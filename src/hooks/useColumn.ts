// Responsible for resolving a single column by numeric id using the public column list.
import { useEffect, useState } from "react";
import { fetchColumnList } from "../services/columns";
import type { Column } from "../types";

// Module-level cache shared with useArticleColumn to avoid duplicate requests.
let cachedColumns: Column[] | null = null;
let fetchPromise: Promise<Column[]> | null = null;

function fetchColumnListCached(): Promise<Column[]> {
  if (cachedColumns !== null) return Promise.resolve(cachedColumns);
  if (fetchPromise !== null) return fetchPromise;
  fetchPromise = fetchColumnList().then((columns) => {
    cachedColumns = columns;
    return columns;
  });
  return fetchPromise;
}

export { fetchColumnListCached };

interface UseColumnResult {
  column: Column | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useColumn(id: number): UseColumnResult {
  const [column, setColumn] = useState<Column | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    fetchColumnListCached()
      .then((columns) => {
        if (cancelled) return;
        const found = columns.find((c) => c.id === id) ?? null;
        setColumn(found);
        if (!found) setErrorMessage("专栏不存在。");
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage("专栏加载失败，请稍后再试。");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { column, isLoading, errorMessage };
}
