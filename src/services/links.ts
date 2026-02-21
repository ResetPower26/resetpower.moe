// Responsible for fetching and mutating link exchange data via /api/links/* endpoints.
import type { SocialLink } from "../types";
import { getToken } from "./auth";

interface LinkInput {
  name: string;
  description: string;
  avatar: string;
  link: string;
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

export async function fetchLinkList(): Promise<SocialLink[]> {
  const data = await apiFetch<{ links: SocialLink[] }>("/api/links/list");
  return data.links;
}

export async function createLink(input: LinkInput): Promise<void> {
  await apiFetch("/api/links", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function updateLink(id: number, input: LinkInput): Promise<void> {
  await apiFetch(`/api/links/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function deleteLink(id: number): Promise<void> {
  await apiFetch(`/api/links/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
