// Responsible for managing admin CRUD state for the link_exchange table.
import { useCallback, useEffect, useState } from "react";
import {
  createLink,
  deleteLink,
  fetchLinkList,
  updateLink,
} from "../services/links";
import type { SocialLink } from "../types";

interface LinkInput {
  name: string;
  description: string;
  avatar: string;
  link: string;
}

interface UseAdminLinksResult {
  links: SocialLink[];
  isLoading: boolean;
  error: string | null;
  submitLink: (input: LinkInput, id?: number) => Promise<boolean>;
  removeLink: (id: number) => Promise<boolean>;
}

export function useAdminLinks(): UseAdminLinksResult {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLinkList();
      setLinks(data);
    } catch {
      setError("加载链接列表失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const submitLink = useCallback(
    async (input: LinkInput, id?: number): Promise<boolean> => {
      try {
        if (id !== undefined) {
          await updateLink(id, input);
        } else {
          await createLink(input);
        }
        await loadLinks();
        return true;
      } catch {
        return false;
      }
    },
    [loadLinks],
  );

  const removeLink = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteLink(id);
        await loadLinks();
        return true;
      } catch {
        return false;
      }
    },
    [loadLinks],
  );

  return { links, isLoading, error, submitLink, removeLink };
}
