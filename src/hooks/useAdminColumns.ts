// Responsible for managing admin CRUD state for the columns table.
import { useCallback, useEffect, useState } from "react";
import {
  type ColumnInput,
  createColumn,
  deleteColumn,
  fetchColumnList,
  updateColumn,
} from "../services/columns";
import type { Column } from "../types";

interface UseAdminColumnsResult {
  columns: Column[];
  isLoading: boolean;
  error: string | null;
  submitColumn: (input: ColumnInput, id?: number) => Promise<boolean>;
  removeColumn: (id: number) => Promise<boolean>;
}

export function useAdminColumns(): UseAdminColumnsResult {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadColumns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchColumnList();
      setColumns(data);
    } catch {
      setError("加载专栏列表失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  const submitColumn = useCallback(
    async (input: ColumnInput, id?: number): Promise<boolean> => {
      try {
        if (id !== undefined) {
          await updateColumn(id, input);
        } else {
          await createColumn(input);
        }
        await loadColumns();
        return true;
      } catch {
        return false;
      }
    },
    [loadColumns],
  );

  const removeColumn = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteColumn(id);
        await loadColumns();
        return true;
      } catch {
        return false;
      }
    },
    [loadColumns],
  );

  return { columns, isLoading, error, submitColumn, removeColumn };
}
