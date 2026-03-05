// Responsible for dynamically setting the document title and restoring the default on unmount.
import { useEffect } from "react";

const DEFAULT_TITLE = "ResetPower";

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} / ${DEFAULT_TITLE}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [pageTitle]);
}
