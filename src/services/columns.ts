// Responsible for fetching and mutating column data via /api/columns/* endpoints.
import type { Column } from "../types";
import { getToken } from "./auth";

export interface ColumnInput {
  name: string;
  description: string;
  cover_image: string;
  article_ids: string;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchColumnList(): Promise<Column[]> {
  const data = await apiFetch<{ columns: Column[] }>("/api/columns/list");
  return data.columns;
}

export async function createColumn(input: ColumnInput): Promise<void> {
  await apiFetch("/api/columns", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function updateColumn(
  id: number,
  input: ColumnInput,
): Promise<void> {
  await apiFetch(`/api/columns/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function deleteColumn(id: number): Promise<void> {
  await apiFetch(`/api/columns/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
