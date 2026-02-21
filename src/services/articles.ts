// Responsible for fetching and mutating article data via /api/articles/* endpoints.
import type { Article, ArticleDetail } from "../types";
import { getToken } from "./auth";

export interface ArticleInput {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string;
  disclosure: string;
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

export async function fetchArticleList(): Promise<Article[]> {
  const data = await apiFetch<{ articles: Article[] }>("/api/articles/list");
  return data.articles;
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const data = await apiFetch<{ article: ArticleDetail }>(
    `/api/articles/${slug}`,
  );
  return data.article;
}

export async function fetchArticleById(id: string): Promise<ArticleDetail> {
  const data = await apiFetch<{ article: ArticleDetail }>(
    `/api/articles/id/${id}`,
  );
  return data.article;
}

export async function createArticle(input: ArticleInput): Promise<void> {
  await apiFetch("/api/articles", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function updateArticle(
  id: string,
  input: Omit<ArticleInput, "slug">,
): Promise<void> {
  await apiFetch(`/api/articles/id/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await apiFetch(`/api/articles/id/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
