// Responsible for managing admin CRUD state for the projects table.
import { useCallback, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchProjectList,
  updateProject,
} from "../services/projects";
import type { Project } from "../types";

interface ProjectInput {
  name: string;
  description: string;
  tags: string;
  link: string;
  link_demo?: string | null;
}

interface UseAdminProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  submitProject: (input: ProjectInput, id?: number) => Promise<boolean>;
  removeProject: (id: number) => Promise<boolean>;
}

export function useAdminProjects(): UseAdminProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjectList();
      setProjects(data);
    } catch {
      setError("加载项目列表失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const submitProject = useCallback(
    async (input: ProjectInput, id?: number): Promise<boolean> => {
      try {
        if (id !== undefined) {
          await updateProject(id, input);
        } else {
          await createProject(input);
        }
        await loadProjects();
        return true;
      } catch {
        return false;
      }
    },
    [loadProjects],
  );

  const removeProject = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteProject(id);
        await loadProjects();
        return true;
      } catch {
        return false;
      }
    },
    [loadProjects],
  );

  return { projects, isLoading, error, submitProject, removeProject };
}
