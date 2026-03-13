// Responsible for resolving a column name from its id using the shared column list cache.
import { useEffect, useState } from "react";
import type { Column } from "../types";
import { fetchColumnListCached } from "./useColumn";

interface UseArticleColumnResult {
  column: Column | null;
  isLoading: boolean;
}

export function useArticleColumn(
  columnId: number | null,
): UseArticleColumnResult {
  const [column, setColumn] = useState<Column | null>(null);
  const [isLoading, setIsLoading] = useState(columnId !== null);

  useEffect(() => {
    if (columnId === null) {
      setColumn(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchColumnListCached()
      .then((columns) => {
        if (!cancelled) {
          setColumn(columns.find((c) => c.id === columnId) ?? null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [columnId]);

  return { column, isLoading };
}
