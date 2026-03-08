// Responsible for fetching the public column list and exposing loading/error states.
import { useEffect, useState } from "react";
import { fetchColumnList } from "../services/columns";
import type { Column } from "../types";

interface UseColumnsResult {
  columns: Column[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useColumns(): UseColumnsResult {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);
    fetchColumnList()
      .then((data) => {
        if (!cancelled) setColumns(data);
      })
      .catch(() => {
        if (!cancelled) setErrorMessage("加载专栏列表失败");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { columns, isLoading, errorMessage };
}
