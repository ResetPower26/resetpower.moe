// Responsible for fetching the project list and managing loading/error state.
import { useEffect, useState } from "react";
import { fetchProjectList } from "../services/projects";
import type { Project } from "../types";

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectList()
      .then(setProjects)
      .catch(() => setErrorMessage("项目加载失败，请稍后再试。"))
      .finally(() => setIsLoading(false));
  }, []);

  return { projects, isLoading, errorMessage };
}
