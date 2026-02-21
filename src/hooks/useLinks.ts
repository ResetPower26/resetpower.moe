// Responsible for fetching the link exchange list and managing loading/error state.
import { useEffect, useState } from "react";
import { fetchLinkList } from "../services/links";
import type { SocialLink } from "../types";

interface UseLinksResult {
  links: SocialLink[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useLinks(): UseLinksResult {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLinkList()
      .then(setLinks)
      .catch(() => setErrorMessage("链接加载失败，请稍后再试。"))
      .finally(() => setIsLoading(false));
  }, []);

  return { links, isLoading, errorMessage };
}
