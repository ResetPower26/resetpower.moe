// Responsible for fetching and mutating project data via /api/projects/* endpoints.
import type { Project } from "../types";
import { getToken } from "./auth";

interface ProjectInput {
  name: string;
  description: string;
  tags: string;
  link: string;
  link_demo?: string | null;
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

export async function fetchProjectList(): Promise<Project[]> {
  const data = await apiFetch<{ projects: Project[] }>("/api/projects/list");
  return data.projects;
}

export async function createProject(input: ProjectInput): Promise<void> {
  await apiFetch("/api/projects", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function updateProject(
  id: number,
  input: ProjectInput,
): Promise<void> {
  await apiFetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await apiFetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
